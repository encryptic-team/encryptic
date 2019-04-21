/**
 * @module components/remotestorage/Adapter
 */
import RemoteStorage from 'remotestoragejs';
import _ from 'underscore';
import Radio from 'backbone.radio';
import Backbone from 'backbone';
import Module from './Module';
import deb from 'debug';

const log = deb('lav:components/sync/RemoteStorage');

/**
 * RemoteStorage cloud class
 *
 * @class
 * @license MPL-2.0
 */
export default class RemoteStorageSync {

    /**
     * @param {Object} configs - app settings
     */
    constructor(configs) {
        this.address = configs.remotestorageAddress;
        this.token   = configs.remotestorageToken;

        /**
         * RemoteStorage instance
         *
         * @prop {Object}
         */
        this.rs = new RemoteStorage({modules: [Module], cache: false});
        this.rs.access.claim('encryptic', 'rw');
        this.rs.on('disconnected', () => {
            delete this.rs;
        });
    }

    /**
     * Check authentication
     *
     * @returns {Promise}
     */
    checkAuth() {
        // The access token was saved in configs
        if (this.token && this.token !== '') {
            return new Promise((resolve, reject) => {
                this.rs.on('connected', () => resolve(true));
                this.rs.on('error', e => reject(e));

                this.rs.connect(this.address, this.token);
            });
        }

        return this.checkHash();
    }

    /**
     * If the access token isn't in configs, check the hash to find it
     *
     * @returns {Promise}
     */
    checkHash() {
        const hash = this.parseHash();
        if (hash.access_token && hash.access_token !== '') {
            log(`Access token: ${hash.access_token}`);

            this.saveAccessToken(hash.access_token);

            if (hash.state) {
                Radio.request('utils/Url', 'navigate', {url: `/${hash.state}`});
            }

            return this.checkAuth();
        }

        this.rs.disconnect();
        return Promise.reject('404: RemoteStorage token not found');
    }

    /**
     * Parse the location hash
     *
     * @returns {Object}
     */
    parseHash() {
        const hash = Backbone.history.fragment.split('&');
        const ret  = {};

        if (!hash.length) {
            return ret;
        }

        _.each(hash, str => {
            const parts = str.split('=');

            if (parts.length > 1) {
                const key = parts[0];
                let val   = parts[1];
                val       = decodeURIComponent(val.trim());
                ret[key] = val;
            }
        });

        return ret;
    }

    /**
     * Save the access token in configs
     *
     * @param {String} accessToken
     * @returns {Promise}
     */
    saveAccessToken(accessToken) {
        this.token = accessToken;

        return Radio.request('collections/Configs', 'saveConfig', {
            config: {name: 'remotestorageToken', value: accessToken},
        });
    }

    /**
     * Find all models of a particular collection type
     *
     * @param {String} profileId
     * @param {String} type - [notes|notebooks|tags|files]
     * @returns {Promise}
     */
    find({profileId, type}) {
        return this.rs.encryptic.getAll(`${profileId}/${type}/`);
    }

    /**
     * Save a Backbone model
     *
     * @param {Object} model - Backbone model
     * @param {String} profileId
     * @returns {Promise}
     */
    saveModel({model, profileId}) {
        log('saveModel()');

        // Don't do anything with empty models
        if (!model.id) {
            return Promise.resolve();
        }

        return this.rs.encryptic.saveModel(
            this.getModelPath(model, profileId),
            model.storeName,
            model.getData()
        );
    }

    /**
     * Get a model's path
     *
     * @param {Object} model - Backbone model
     * @returns {String}
     */
    getModelPath(model, profileId) {
        return `/${profileId}/${model.storeName}/${model.id}.json`;
    }

    /**
	 * Terminate connection to the RemoteStorage server
	 *
	 * @returns {Promise}
	 */
    async disconnect() {
        if (!this.rs) {
            return;
        }

        await Radio.request('collections/Configs', 'saveConfig', {
            config: {name: 'remotestorageToken', value : ''},
        });

        this.rs.disconnect();
    }
}
