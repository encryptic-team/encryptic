/**
 * @module models/BaseModel
 */
import {Model} from 'backbone';
import Sync from '../components/Sync';
import _ from 'underscore';
import Radio from 'backbone.radio';

/**
 * Core model.
 *
 * @class
 * @extends Model Backbone model
 * @license MPL-2.0
 */

/*
 * When making an new model that extends this class, the following methods need to be implemented:
 *
 *   get validateAttributes():
 * It should contain an array of attribute names that should not be empty.
 *
 *   get escapeAttributes()
 * It should contain an array of attribute names that should be filtered from XSS.
 * 
 * 
*/


 export default class BaseModel extends Model {
    
    constructor(data, options = {}) {
        super(data, options);
        this.profileId = options.profileId;
    }

    /**
     * Override Backbone.sync.
     *
     * @returns {Function}
     */
    get sync() {
        return Sync.use();
    }

    /**
     * Profile ID.
     *
     * @returns {String}
     */
    get profileId() {
        return this._profileId;
    }

    /**
     * Change profile ID
     *
     * @param {String} name
     */
    set profileId(name) {
        this._profileId = name;
    }

    /**
     * Radio channel.  'collections/$(Storename)'.  First letter in 'Storename' is capitalized.
     *
     * @returns {Object}
     */
    get channel() {
        const name = _.capitalize(this.storeName);
        return Radio.channel(`collections/${name}`);
    }

    /**
     * Validate a model.
     *
     * @param {Object} attrs
     * @returns {(Array|Undefined)} - array of errors if there are any
     */
    validate(attrs) {
        // It's not neccessary to validate when a model is about to be removed
        if (attrs.trash && Number(attrs.trash) === 2) {
            return;
        }
        const errors = [];
        // Validate attributes
        _.each(this.validateAttributes, field => {
            const item = attrs[field];
            if (!item || (typeof item === 'string' && !item.trim().length)) {
                errors.push(field);
            }
        });

        if (errors.length > 0) {
            return errors;
        }
    }

    /**
     * Set new attributes filtering them from XSS.
     *
     * @param {Object} attrs
     * @returns {Object} this
     */
    setEscape(attrs) {
        const data = this.getData(attrs);

        // Filter from XSS
        _.each(this.escapeAttributes, attr => {
            if (data[attr]) {
                data[attr] = _.cleanXSS(data[attr], true);
            }
        });

        // Set new attributes
        this.set(data);
        this.setDate();

        return this;
    }

    /**
     * Return attributes that exist in defaults property.
     *
     * @param {Object} attrs=this.attributes
     * @returns {Object}
     */
    getData(attrs = this.attributes) {
        const data = _.pick(attrs, _.keys(this.defaults));

        if (!attrs.encryptedData || !attrs.encryptedData.length) {
            return data;
        }

        return _.omit(data, this.encryptKeys);
    }

    /**
     * Set the time when a model was updated/created.
     */
    setDate() {
        // Do nothing if the model doesn't have date fields
        if (_.isUndefined(this.defaults.created)) {
            return;
        }

        this.set('updated', Date.now());
        this.set('created', this.get('created') || Date.now());
    }

    /**
     * Check if the model is shared with a user.
     *
     * @param {String} username
     * @returns {Boolean}
     */
    isSharedWith(username) {
        return (
            _.indexOf(this.get('sharedWith'), username) !== -1 ||
            this.get('sharedBy') === username
        );
    }

    /**
     * Share the document with a user.
     *
     * @param {String} username
     */
    toggleShare(username) {
        let sharedWith = this.get('sharedWith') || [];

        if (this.isSharedWith(username)) {
            sharedWith = _.without(sharedWith, username);
        }
        else {
            sharedWith.push(username);
            this.set({sharedWith: []});
        }

        this.set({sharedWith});
    }

}
