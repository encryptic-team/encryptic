/**
 * @module models/Profile
 */
import BaseModel from './BaseModel';

/**
 * Profile model.
 *
 * @class
 * @extends module:models/BaseModel
 * @license MPL-2.0
 */
export default class Profile extends BaseModel {

    get storeName() {
        return 'profiles';
    }

    /**
     * Use username as ID.
     *
     * @returns {String}
     */
    get idAttribute() {
        return 'username';
    }

    /**
     * Default values.
     *
     * @prop {String} username
     * @prop {String} privateKey - private key
     * @prop {String} publicKey - public key
     * @returns {Object}
     */
    get defaults() {
        return {
            username   : '',
            privateKey : '',
            publicKey  : '',
        };
    }

    get validateAttributes() {
        return ['username'];
    }

    get escapeAttributes() {
        return ['username'];
    }

    constructor(options) {
        super(options, {profileId: 'default'});
    }

}
