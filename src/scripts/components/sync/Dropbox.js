/**
 * @module components/sync/Dropbox
 */
import {Dropbox} from 'dropbox';
import _ from 'underscore';
import Radio from 'backbone.radio';
import Backbone from 'backbone';
import constants from '../../constants';
import deb from 'debug';

const log = deb('lav:components/sync/Dropbox');

/**
 * Dropbox cloud class
 *
 * @class
 * @license MPL-2.0
 */
export default class DropboxSync {

    /**
     * Default Dropbox app key, set to constants because it should never change.
     *
     * @prop {String}
     */
    get clientKey() {
        return constants.dropboxKey;
    }

    /**
     * @param {Object} configs - app settings
     */
    constructor(configs) {
        const {dropboxKey} = configs;
        this.configs       = _.extend(
            {
                clientKey   : dropboxKey.length ? dropboxKey : this.clientKey,
                accessToken : configs.dropboxAccessToken,
            },
            configs
        );

        /**
         * Dropbox instance
         *
         * @prop {Object}
         */
        this.dbx = new Dropbox({clientId: this.configs.clientKey});
    }

    /**
     * Check authentication.
     *
     * @returns {Promise}
     */
    checkAuth() { // eslint-disable-line complexity
        const hash = this.parseHash();

        // The access token was saved in configs
        if (this.configs.accessToken && this.configs.accessToken.length) {
            this.dbx.setAccessToken(this.configs.accessToken);
            return Promise.resolve(true);
        }
        // A user has granted the permission
        else if (hash.access_token && hash.access_token.length) {
            log(`Access token: ${hash.access_token}`);
            return this.saveAccessToken(hash.access_token);
        }
        else {
            // Clear the location hash if there was an error with auth
            if (hash.error) {
                Radio.request('utils/Url', 'navigate', {url: '/'});
            }

            return this.authenticate();
        }
    }

    /**
     * Parse the location hash.
     *
     * @param {String} url
     * @returns {Object}
     */
    parseHash(url = Backbone.history.fragment) {
        const hash = url.split('&');
        const ret  = {};

        if (!hash.length) {
            return ret;
        }

        _.each(hash, str => {
            const parts = str.replace(/\+/g, ' ').split('=');

            if (parts.length > 1) {
                const key = parts.shift();
                let val   = parts.length > 0 ? parts.join('=') : undefined;
                val       = undefined ? null : decodeURIComponent(val.trim());
                ret[key]  = val;
            }
        });

        return ret;
    }

    /**
     * Authenticate.
     *
     * @returns {Promise}
     */
    authenticate() {
        if (window.cordova) {
            return this.authCordova();
        }
    }

    /**
     * Authenticate in Cordova environment (requires inappbrowser plugin).
     *
     * @returns {Promise} - true if authenticated
     */
    authCordova() {
        return new Promise(resolve => {
            this.dbx.authenticateWithCordova(
                accessToken => {
                    this.saveAccessToken(accessToken).then(resolve);
                },
                () => resolve(false)
            );
        });
    }

    /**
     * Save the access token in configs.
     *
     * @param {String} accessToken
     * @returns {Promise}
     */
    async saveAccessToken(accessToken) {
        await Radio.request('collections/Configs', 'saveConfig', {
            config: {name: 'dropboxAccessToken', value: accessToken},
        });

        // Redirect to the main page again
        Radio.request('utils/Url', 'navigate', {url: '/'});
        this.configs.accessToken = accessToken;
        return true;
    }

    /**
     * Find all models of a particular collection type.
     *
     * @param {String} profileId
     * @param {String} type - [notes|notebooks|tags|files]
     * @returns {Promise}
     */
    async find({profileId, type}) {
        const resp     = await this.readDir({path: `/${profileId}/${type}`});
        const promises = [];

        _.each(resp.entries, file => {
            if (file.name.search('.json') !== -1) {
                promises.push(this.readFile({path: file.path_lower}));
            }
        });

        return Promise.all(promises);
    }

    /**
     * Read a directory on Dropbox.
     *
     * @param {String} {path} - path of the directory
     * @returns {Promise}
     */
    readDir({path}) {
        return this.dbx.filesListFolder({
            path,
            include_deleted : false, // eslint-disable-line
        })
        .catch(err => {
            // Empty folder
            if (err.status === 409) {
                return [];
            }

            return Promise.reject(err);
        });
    }

    /**
     * Read a file on Dropbox.
     *
     * @param {String} {path} - path of the file
     * @returns {Promise}
     */
    async readFile({path}) {
        log('sync/Dropbox: readFile()');
        const resp = await this.dbx.filesDownload({path});
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.addEventListener('loadend', () => {
                resolve(JSON.parse(reader.result));
            });
            reader.readAsText(resp.fileBlob);
        });
    }

    /**
     * Save a Backbone model to Dropbox.
     *
     * @param {Object} model - Backbone model
     * @param {String} profileId
     * @returns {Promise}
     */
    saveModel({model, profileId}) {
        // Don't do anything with empty models
        if (!model.id) {
            return Promise.resolve();
        }

        return this.dbx.filesUpload({
            path       : this.getModelPath(model, profileId),
            autorename : false,
            mode       : {'.tag': 'overwrite'},
            contents   : JSON.stringify(model.getData()),
        });
    }

    /**
     * Get a model's Dropbox path.
     *
     * @param {Object} model - Backbone model
     * @returns {String}
     */
    getModelPath(model, profileId) {
        return `/${profileId}/${model.storeName}/${model.id}.json`;
    }
}
