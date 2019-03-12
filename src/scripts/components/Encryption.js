/**
 * @module components/Encryption
 */
import * as openpgp from 'openpgp';
import sjcl from 'sjcl';
import Radio from 'backbone.radio';
import _ from 'underscore';

import deb from 'debug';

const log = deb('lav:components/Encryption');

/**
 * Encryption class.
 * Almost every method in this class can be requested with Radio requests.
 *
 * @class
 * @extends module:workers/Module
 * @license MPL-2.0
 */
export default class Encryption {

    /**
     * Radio channel (components/Encryption).
     *
     * @prop {Object}
     */
    get channel() {
        return Radio.channel('components/Encryption');
    }

    /**
     * App configs.
     *
     * @prop {Object}
     */
    get configs() {
        return Radio.request('collections/Configs', 'findConfigs');
    }

    /**
     * A user's profile.
     *
     * @prop {Object}
     */
    get user() {
        return Radio.request('collections/Profiles', 'getUser').attributes;
    }

    constructor(options = {}) {
        this.options = options;
        this.openpgp = openpgp;

        // Disable compression for performance
        this.openpgp.config.compression  = 0;

        // Don't use native crypto to use WebWorkers
        this.openpgp.config.use_native = false; // eslint-disable-line
        this.openpgp.initWorker({path: 'scripts/openpgp.worker.js'});

        // Reply to core requests
        this.channel.reply({
            // Core methods
            sha256            : this.sha256,
            random            : this.random,
            readKeys          : this.readKeys,
            readUserKey       : this.readUserKey,
            generateKeys      : this.generateKeys,
            changePassphrase  : this.changePassphrase,
            sign              : this.sign,
            verify            : this.verify,
            encrypt           : this.encrypt,
            decrypt           : this.decrypt,
            // Backbone related methods
            encryptModel      : this.encryptModel,
            decryptModel      : this.decryptModel,
            encryptCollection : this.encryptCollection,
            decryptCollection : this.decryptCollection,
            saveKeys          : this.saveKeys,
            getUserKeys       : this.getUserKeys,
        }, this);
    }

    /**
     * Calculate sha256 hash of the string set.
     *
     * @public
     * @param {Object} options={}
     * @param {String} options.text
     * @returns {Promise}
     */
    sha256(options = {}) {
        return Promise.resolve(sjcl.hash.sha256.hash(options.text));
    }

    /**
     * Generate random characters.
     *
     * @public
     * @param {Object} options
     * @param {Number} options.number
     * @returns {Promise} resolve with string
     */
    random(options = {}) {
        const random = sjcl.random.randomWords(options.number || 4, 0);
        return Promise.resolve(sjcl.codec.hex.fromBits(random));
    }

    /**
     * Read the user's key pairs and other users' public keys.
     *
     * @public
     * @param {Object} options=this.options
     * @param {String} options.privateKey
     * @param {String} options.passphrase
     * @returns {Object}
     */
    readKeys(options = this.options) {
        log('Encryption.js: readKeys()');
        const success = (async() => {
            this.options   = _.extend(this.options, options);
            let privateKey = this.options.privateKey || this.user.privateKey;
            privateKey = (await this.openpgp.key.readArmored(privateKey)).keys[0];
            /**
             * A user's key pairs.
             *
             * @prop {Object}
             * @prop {Object} publicKeys
             * @prop {Object} privateKey - the private key
             */
            this.keys = {
                privateKey,
                privateKeys : [privateKey],
                publicKeys  : {},
            };


            // Try to decrypt the private key
            if ((await this.keys.privateKey.decrypt(options.passphrase)) === false) {
                return Promise.reject('Cannot decrypt the private key');
            }

            // My public key
            const username = this.user.username;
            this.keys.publicKeys[username] = this.keys.privateKeys[0].toPublic();

            return this.readPublicKeys()
            .then(() => {
                return this.keys;
            });
        })()
        .then(successmessage => {
            Radio.request('components/Encryption', 'saveKeys', successmessage);
            return successmessage;
        });
        return success;
    }

    saveKeys(keys) {
        this.keys = keys;
    }

    /**
     * Read public keys of the trusted users.
     *
     * @protected
     * @todo user profileId when fetching users?
     * @param {Object} options
     * @returns {Promise}
     */
    readPublicKeys() {
        log('encryption: readPublicKeys()');
        return Radio.request('collections/Users', 'find')
        .then(collection => {
            collection.each(model => {
                if (!model.get('pendingAccept')) {
                    this.readUserKey({model});
                }
            });
        });
    }

    /**
     * Read a user's public key and save it to this.keys.publicKeys
     *
     * @public
     * @param {Object} model - user model
     * @returns {Object} key
     */
    readUserKey({model}) {
        log('encryption: readUserKey()');
        const pubkey = model.attributes.publicKey;
        (async() => {
            const key = (await this.openpgp.key.readArmored(pubkey).keys[0]);
            this.keys.publicKeys[model.get('username')] = key;
            return key;
        })();
    }

    /**
     * Generate new key pair.
     *
     * @public
     * @param {Object} options
     * @param {Array} options.userIds
     * @param {String} options.passphrase
     * @returns {Promise} - resolves with an object {privateKey, publicKey}
     */
    generateKeys(options) {
        log('encryption: generateKeys()');
        const opt = _.extend({
            numBits: 2048,
        }, options);

        log('generating new key pair...');
        return this.openpgp.generateKey(opt)
        .then(key => {
            return {
                privateKey : key.privateKeyArmored,
                publicKey  : key.publicKeyArmored,
            };
        });
    }

    /**
     * Change the passphrase of a private key.
     *
     * @public
     * @param {Object} options
     * @param {String} options.newPassphrase
     * @param {String} options.oldPassphrase
     * @returns {Promise} resolves with the new private key
     */
    changePassphrase(options) {
        log('encryption: changePassphrase()');
        const privateKey = this.openpgp.key.readArmored(this.user.privateKey).keys[0];

        // Try to decrypt the private key
        if (!privateKey.decrypt(options.oldPassphrase)) {
            return Promise.reject('Wrong old passphrase');
        }

        // Encrypt the key with the new passphrase
        let newKeyArmored;
        try {
            const packets = privateKey.getAllKeyPackets();
            for (let i = 0; i < packets.length; i++) {
                packets[i].encrypt(options.newPassphrase);
            }

            newKeyArmored = privateKey.armor();
        }
        catch (e) {
            return Promise.reject('Setting new passphrase failed');
        }

        return Promise.resolve(newKeyArmored);
    }

    /**
     * Sign a message using the user's private key.
     *
     * @public
     * @param {String} data
     * @returns {Promise}
     */
    sign({data}) {
        log('encryption: sign()');
        const message = this.openpgp.message.fromText(data);
        return this.openpgp.sign({message, privateKeys: this.keys.privateKey})
        .then(sign => sign.data);
    }

    /**
     * Verify a signature.
     *
     * @public
     * @param {Object} options
     * @param {String} options.message
     * @param {Array}  [options.publicKeys]
     * @param {String} [options.username] - the name of the user who signed
     * the message
     * @returns {Promise}
     */
    verify(options) {
        log('encryption: verify()');
        const message = this.openpgp.cleartext.readArmored(options.message);
        const keys    = options.publicKeys || this.getUserKeys(options.username);
        return this.openpgp.verify({message, publicKeys: keys.publicKeys || keys});
    }

    /**
     * Return an object that contains a user's public key.This was originally marked protected, but
     * in components/settings/show/encryption/View.js we then go out of our way to obtain
     * the private key in a way that's neither maintainable nor compatible with the current version
     * (4.0.1) of openpgpjs.
     * As such (and since anyone can get the private key by looking in localstorage anyway),
     * I'm going to be practical here.
     *
     * @public
     * @param {String} [username]
     * @return {Object} - {privateKeys, publicKeys}
     */
    getUserKeys(username) {
        log('encryption: getUserKeys()');
        const publicKeys = [this.keys.publicKeys[this.user.username]];


        if (username && this.keys.publicKeys[username] &&
            username !== this.user.username) {
            publicKeys.push(this.keys.publicKeys[username]);
        }

        log('encryption: getUserKeys(): returning keys');
        return {
            publicKeys,
            privateKey : this.keys.privateKey,
            privateKeys: this.keys.privateKeys,
        };
    }

    /**
     * Encrypt string data with PGP keys.
     * If keys aren't provided, it will use the keys from this.user property.
     *
     * @public
     * @param {Object} options
     * @param {String} options.data - data that should be encrypted
     * @param {String} [options.username] - the name of the user for whom
     * it should be encrypted
     * @returns {Promise} - resolves with an encrypted string
     */
    async encrypt(options) {
        log('encryption: encrypt(): starting data:');
        log(options.data);
        const keys = this.getUserKeys(options.username);
        // openpgp 4 needs a 'message', not 'data'
        if (keys.publickeys === null && keys.privateKey === null) {
            // eslint-disable-next-line max-len
            log('encryption: encrypt(): no pub/priv key found. Is this an old laverna import?');
            return options.data;
        }

        const encryptOptions = options;
        encryptOptions.message = this.openpgp.message.fromText(options.data);
        encryptOptions.publicKeys = keys.publicKeys;
        encryptOptions.privateKeys = keys.privateKeys;

        // importing from laverna 0.7.51 throws a "Unknown ASCII armor type" error here.
        // I think it is breaking the import.
        const enc  = await this.openpgp.encrypt(encryptOptions);
        return enc.data;
    }

    /**
     * Decrypt armored data with PGP keys.
     * If keys aren't provided, it will use the keys from this.user property.
     *
     * @public
     * @param {Object} options
     * @param {String} options.message  - message which should be decrypted
     * @param {String} [options.username] - the name of the user who encrypted
     * the message
     * @returns {Promise}
     */
    async decrypt(options) {
        log('encryption: decrypt()');
        const t0 = performance.now();
        const keys = this.getUserKeys(options.username);
        const t3 = performance.now();
        const data = _.extend({}, keys, options, {
            message : await this.openpgp.message.readArmored(options.message),
        });
        const t4 = performance.now();
        log(`Encryption.js: readArmored() end +${(t4 - t3).toString()}`);
        const plaintext = this.openpgp.decrypt(data).then(plaintext => {
            return plaintext.data;
        });
        const t1 = performance.now();
        log(`Encryption.js: decrypt() end +${(t1 - t0).toString()}`);
        return plaintext;
    }

    /**
     * Encrypt a model.
     *
     * @public
     * @param {Object} model
     * @param {String} [username]
     * @returns {Promise} resolve with the model
     */
    async encryptModel({model, username}) {
        log('encryption: encryptModel()');
        // Don't encrypt if encryption is disabled
        if (!Number(this.configs.encrypt)) {
            log('do not encrypt');
            return Promise.resolve(model);
        }

        const data = _.pick(model.attributes, model.encryptKeys);
        const encryptedData = await this.encrypt({username, data: JSON.stringify(data)});
        model.set({encryptedData});
        return model;
    }

    /**
     * Decrypt a model.
     *
     * @public
     * @param {Object} model
     * @param {String} [username]
     * @returns {Promise} resolves with the model
     */
    async decryptModel({model, username}) {
        log('encryption: decryptModel()');
        const message = model.attributes.encryptedData;

        if (!message.length) {
            return model;
        }

        this.decrypt({message, username})
        .then(msg => {
            model.set(JSON.parse(msg));
            return model;
        });
    }

    /**
     * Encrypt every model in a collection.
     *
     * @public
     * @param {Object} collection
     * @param {String} [username]
     * @returns {Promise}
     */
    encryptCollection({collection, username}) {
        log('encryption: encryptCollection()');
        // Don't decrypt if the collection is empty or encryption is disabled
        if (!collection.length || !Number(this.configs.encrypt)) {
            return Promise.resolve(collection);
        }

        const promises = [];
        collection.each(model => {
            promises.push(this.encryptModel({model, username}));
        });

        return Promise.all(promises)
        .then(() => collection);
    }

    /**
     * Decrypt every model in a collection.
     *
     * @public
     * @param {Object} collection
     * @param {String} [username]
     * @returns {Promise}
     */
    decryptCollection({collection, username}) {
        log('encryption: decryptCollection()');
        if (!collection.length) {
            return Promise.resolve(collection);
        }

        const promises = [];
        collection.each(model => {
            promises.push(this.decryptModel({model, username}));
        });

        return Promise.all(promises)
        .then(() => collection);
    }

}
