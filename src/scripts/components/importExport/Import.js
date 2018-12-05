/**
 * @module components/importExport/Import
 */
import {MnObject} from 'backbone.marionette';
import _ from 'underscore';
import Radio from 'backbone.radio';
import JSZip from 'jszip';
import * as openpgp from 'openpgp';
import Migrate from './migrate/Controller';
import deb from 'debug';
import localforage from 'localforage';

const log = deb('lav:components/importExport/Import');

/**
 * Import data to Encryptic from a ZIP archive.
 *
 * @class
 * @extends Marionette.Object
 * @license MPL-2.0
 */
export default class Import extends MnObject {

    /**
     * Radio channel (components/importExport).
     *
     * @prop {Object}
     */
    get channel() {
        return Radio.channel('components/importExport');
    }

    /**
     * Current user's profile data.
     *
     * @prop {Object}
     */
    get user() {
        return Radio.request('collections/Profiles', 'getUser');
    }

    /**
     * Available profiles.
     *
     * @prop {Object} Backbone collection
     */
    get profiles() {
        return Radio.request('collections/Profiles', 'findProfiles');
    }

    /**
     * An array of collection names which are allowed to be imported.
     *
     * @prop {Array}
     */
    get collections() {
        return ['notebooks', 'tags', 'configs', 'users', 'files', 'profiles'];
    }

    init() { // eslint-disable-line complexity
        this.isOldBackup = false;
        if (this.options.files && this.options.files.length) {
            if (this.isZipFile()) {
                return this.importData();
            }
            else if (this.isKey()) {
                return this.importKey();
            }
        }

        // Do nothing if there aren't any ZIP archives
        return Promise.resolve();
    }

    /**
     * If import is successful, trigger "completed" and reload the page after 800ms.
     */
    onSuccess() {
        const msg = !this.isOldBackup ? 'Import success' : 'Old backup import success';
        this.channel.trigger('completed', {msg});

        // Reload the page only if it isn't a backup from an older version
        if (!this.isOldBackup) {
            window.setTimeout(() => document.location.reload(), 800);
        }
        // Force migration if this is a backup from an older version.
        if (this.isOldBackup) {
            new Migrate().init();
        }
    }

    /**
     * If import failed, trigger "completed" event with the error.
     *
     * @param {String} error
     */
    onError(error) {
        log('error', error);
        this.channel.trigger('completed', {error, msg: 'Import error'});
    }

    /**
     * Check if a file is a ZIP archive.
     *
     * @param {Object} file=this.options.files[0]
     * @param {String} file.type
     * @param {String} file.name
     * @returns {Boolean}
     */
    isZipFile(file = this.options.files[0]) {
        return (
            file.type === 'application/zip' ||
            _.last(file.name.split('.')) === 'zip'
        );
    }

    /**
     * Check if a file is a private key.
     *
     * @param {Object} file=this.options.files[0]
     * @param {String} file.type
     * @param {String} file.name
     * @param {String} file.size
     * @returns {Boolean}
     */
    isKey(file = this.options.files[0]) {
        return (
            file.type === 'text/plain' &&
            _.last(file.name.split('.')) === 'asc' &&
            file.size >= 2500
        );
    }

    /**
     * Import everything from a ZIP file.
     *
     * @returns {Promise}
     */
    importData() {
        // Trigger an event that import proccess started
        this.channel.trigger('started');

        return this.readZip(this.options.files[0])
        .then(zip  => this.import(zip))
        .then(()   => this.onSuccess())
        .catch(err => this.onError(err));
    }

    /**
     * Import a private key.
     *
     * @returns {Promise}
     */
    importKey() {
        // Trigger an event that import proccess started
        this.channel.trigger('started');

        return this.getPrivateKey(this.options.files[0])
        .then(res => {
            if (!res || !res.key || !res.username) {
                return null;
            }

            return this.importProfileFromKey(res);
        })
        .then(res => {
            if (!res) {
                return this.onError('Could not recover your profile from the key!');
            }

            this.onSuccess();
        })
        .catch(err => this.onError(err));
    }

    /**
     * Read the armored key and check it.
     *
     * @param {Object} keyFile
     * @returns {Promise} - returns null if the key isn't compatible
     */
    getPrivateKey(keyFile) {
        return this.readText(keyFile)
        .then(armorKey => {
            const {keys, err} = openpgp.key.readArmored(armorKey);
            if (err) {
                throw new Error(err);
            }

            // Don't import if it's just a public key
            if (keys[0].isPublic()) {
                return null;
            }

            return {
                key      : keys[0],
                username : this.getUsernameFromKey(keys[0]),
            };
        });
    }

    /**
     * Get the username from the private key.
     *
     * @param {Object} key
     * @returns {String} returns null if username doesn't exist
     */
    getUsernameFromKey(key) { // eslint-disable-line
        let username = this.options.username;

        // If username wasn't provided, try to get it from the private key
        if (!username || !username.length) {
            username = key.users[0].userId.userid.split('<')[0].trim();
        }

        if (!username || !username.length) {
            log('The key does not contain the username!');
            return null;
        }
        else if (this.profiles && this.profiles.get({username})) {
            log(`Profile ${username} already exists!`);
            return null;
        }

        return username;
    }

    /**
     * Import a user's profile from an OpenPGP private key.
     *
     * @param {Object} key
     * @returns {Promise} resolves with boolean
     */
    importProfileFromKey({key, username}) {
        // First, change the signaling server
        Radio.request('models/Signal', 'changeServer', {
            signal: this.options.signalServer,
        });

        // Try to get the user from signaling server
        return Radio.request('models/Signal', 'findUser', {username})
        .then(user => {
            // The user does not exist on the server or fingerprints don't match
            if (_.isEmpty(user) || user.fingerprint !== key.primaryKey.fingerprint) {
                return false;
            }

            // Save the profile
            return Radio.request('collections/Profiles', 'createProfile', {
                username,
                privateKey : key.armor(),
                publicKey  : key.toPublic().armor(),
            })
            .then(() => true);
        });
    }

    /**
     * Read a text file.
     *
     * @param {Object} file
     * @returns {Promise} resolves with string
     */
    readText(file) {
        return new Promise(resolve => {
            const reader  = new FileReader();
            reader.onload = (e => resolve(e.target.result));
            reader.readAsText(file);
        });
    }

    /**
     * Read a ZIP archive.
     *
     * @param {Object} file
     * @returns {Promise} resolves with JSZip instance
     */
    readZip(file) {
        const reader = new FileReader();
        this.zip     = new JSZip();

        return new Promise((resolve, reject) => {
            reader.onload = evt => {
                console.log("loading file: ");
                console.log(evt.target.result);
                this.zip.loadAsync(evt.target.result)
                .then(() => resolve(this.zip))
                .catch(err => reject(err));
            };

            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Import files from a ZIP archive.
     *
     * @param {Object} zip
     * @returns {Promise}
     */
    import(zip) {
        console.log(zip);
        console.log(this.options.files[0]);
        console.log("files:");

        if (!_.isUndefined(zip.files['laverna-backups/notes-db/configs.json'])) {
            console.log("import: import():  Old laverna backups detected.");
            this.isOldBackup = true;
            return this.importCollections(zip);
        }

        return this.importProfile(zip)
        .then(() => this.importCollections(zip));
    }

    /**
     * Import a user's profile data.
     *
     * @param {Object} zip
     * @returns {Promise}
     */
    importProfile(zip) {
        let filename = "";
        for (let x in zip.files){
            if (x.includes("profiles.json")) {
                filename = x;
            }
        };
        let file = zip.files[filename];
        let name = "Encryptic";
        console.log(file);
        if (!file) {
            file = zip.files['laverna-backups/profiles.json'];
            name = "laverna";
            this.isLavernaBackup = true;
        }

        if (!file && !this.user) {
            return Promise.reject('You need to create a profile first!');
        }
        console.log(name + '-backups/profiles.json');
        return zip.file(filename).async('string')
        .then(res => {
            this.profile = JSON.parse(res)[0];

            if (this.user && this.profile.username !== this.user.get('username')) {
                return Promise.reject('You cannot import another users backup!');
            }

            return this.importCollection({data: [this.profile], type: 'profiles'});
        })
        .then(() => Radio.request('collections/Profiles', 'setUser', this.profile));
    }

    /**
     * Import all collections from the backup.
     *
     * @param {Object} zip
     * @returns {Promise}
     */
    importCollections(zip) {
        const promises = [];
        let configFile;

        console.log("import: importCollections(): isOldBackup is " + this.isOldBackup);
        if (this.isOldBackup)
        {
            _.each(zip.files, file => {
                // Ignore directories and non JSON files
                if (!this.isCollectionFile(file)) {
                    console.log("importCollections(): ignoring " + file);
                    return;
                }
                promises.push(this.readLegacyFile(zip, file));
            });
            return Promise.all(promises);
        }
        else
        {
            _.each(zip.files, file => {
                // Ignore directories and non JSON files
                if (!this.isCollectionFile(file)) {
                    console.log("importCollections(): ignoring " + file);
                    return;
                }

                if (file.name.indexOf('configs.json') === -1) {
                    promises.push(this.readFile(zip, file));
                }
                else {
                    configFile = file;
                }
            });
        }

        // Import configs at the end to avoid encryption errors
        return Promise.all(promises)
        .then(() => this.readFile(zip, configFile));
    }


    /**
     * Insert old data to notes-db database.
     *
     * @param {String} storeName - [notes|notebooks|files|tags|configs]
     * @returns {Promise}
     */
    importOldData(storeName = 'notes', item) {
        const models = [];
        // We check this for a config file.
        let key;
        if (_.isUndefined(item.id))
        {
            key = item.name;
        }
        else
        {
            key = item.id;
        }
        const forage = localforage.createInstance({storeName, name: 'notes-db'})
        return forage.setItem(key, item);
    }

    /**
     * Read a file from an old laverna backup ZIP archive.
     *
     * @param {Object} zip
     * @param {Object} file
     * @returns {Promise}
     */
    readLegacyFile(zip, file) {
        return zip.file(file.name).async('string')
        .then(res => {
            const path      = file.name.split('/');
            const profileId = path[1] !== 'notes-db' ? this.profile.username : path[1];
            const data      = JSON.parse(res);
            //console.log("import: readLegacyFile(): data: ");
            //console.log(data)

            if (path[2] === 'notes') {
                return this.importOldData("notes", data);
            }
            else if (path[2] === 'files') {
                return this.importOldData("files", data);
            }
            else {
                const type = path[2].split('.json')[0];
                for (let i=0; i<data.length; i++)
                {
                    this.importOldData(type, data[i]);
                }
                
                return Promise.resolve();
            }
        });
    }

    /**
     * Return true if it's a file that contains collection data.
     *
     * @param {Object} file
     * @returns {Boolean}
     */
    isCollectionFile(file) {
        return (
            !file.dir && _.last(file.name.split('.')) === 'json' &&
            file.name.indexOf('profiles.json') === -1
        );
    }

    /**
     * Read a file from the ZIP archive.
     *
     * @param {Object} zip
     * @param {Object} file
     * @returns {Promise}
     */
    readFile(zip, file) {
        return zip.file(file.name).async('string')
        .then(res => {
            if (file.name.split("/")[0].includes("Encryptic")) {
                const path      = file.name.split('/');
                const profileId = path[2] !== 'notes-db' ? this.profile.username : path[2];
                const data      = JSON.parse(res);
                //console.log("data: ");
                //console.log(data)
                console.log("readFile(): reading " + path[3] + " file: " + path);
                console.log(path);
                if (path[3] === 'notes') {
                    return this.importNote({zip, profileId, data, name: file.name});
                }
                else if (path[3] === 'files') {
                    return this.importFile({profileId, data});
                }
                else {
                    const type = path[3].split('.json')[0];
                    return this.importCollection({profileId, data, type});
                }
            }
            else {
                const path      = file.name.split('/');
                const profileId = path[1] !== 'notes-db' ? this.profile.username : path[1];
                const data      = JSON.parse(res);
                //console.log("data: ");
                //console.log(data)
                console.log("readFile(): reading " + path[2] + " file: " + path);
                console.log(path);
                if (path[2] === 'notes') {
                    return this.importNote({zip, profileId, data, name: file.name});
                }
                else if (path[2] === 'files') {
                    return this.importFile({profileId, data});
                }
                else {
                    const type = path[2].split('.json')[0];
                    return this.importCollection({profileId, data, type});
                }
            }
        });
    }

    /**
     * Import a note to database.
     *
     * @param {Object} options
     * @param {Object} options.zip - JSZip instance
     * @param {String} options.name - file name of a note
     * @param {String} options.profileId
     * @param {Object} options.data
     * @returns {Promise}
     */
    importNote(options) {
        const {data, profileId} = options;

        return this.readMarkdown(options)
        .then(() => {
            return Radio.request('collections/Notes', 'saveModelObject', {
                data,
                profileId,
                dontValidate: true,
            });
        });
    }

    /**
     * Read a note's content from Markdown file.
     *
     * @param {Object} data
     * @param {String} name
     * @param {Object} zip
     * @returns {Promise}
     */
    readMarkdown({data, name, zip}) {
        if (data.encryptedData && data.encryptedData.length) {
            return Promise.resolve();
        }

        const mdName = name.replace(/\.json$/, '.md');
        return zip.file(mdName).async('string')
        // eslint-disable-next-line
        .then(content => data.content = content);
    }

    /**
     * Import a file attachment to database.
     *
     * @param {Object} options
     * @param {String} options.profileId
     * @param {Object} options.data
     * @returns {Promise}
     */
    importFile(options) {
        const {data, profileId} = options;
        return Radio.request('collections/Files', 'saveModelObject', {
            data,
            profileId,
        });
    }

    /**
     * Import a collection to database.
     *
     * @param {Object} options
     * @param {String} options.type - collection name (notebooks, tags, configs...)
     * @param {String} options.profileId
     * @param {Object} options.data
     * @returns {Promise}
     */
    importCollection(options) {
        // Do nothing if the collection name is incorrect
        if (_.indexOf(this.collections, options.type) === -1) {
            return Promise.resolve();
        }

        const type = _.capitalize(options.type);

        return Radio.request(`collections/${type}`, 'saveFromArray', {
            profileId : options.profileId,
            values    : options.data,
        });
    }

}
