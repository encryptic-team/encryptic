/**
 * @module collections/Profiles
 */
import BaseCollection from './BaseCollection';
import Profile from '../models/Profile';
import deb from 'debug';

const log = deb('lav:collections/Profiles');

/**
 * Profiles collection.
 *
 * @class
 * @extends module:collections/Collection
 * @license MPL-2.0
 */
export default class Profiles extends BaseCollection {

    /**
     * Profile model.
     *
     * @returns {Object}
     */
    get model() {
        return Profile;
    }

    destroyUser(opt) {
        log('destroyUser(): calling destroyDb()');
        this.sync('destroyDb', opt);
    }

    constructor(models) {
        // Change the profileId to "default"
        super(models, {profileId: 'default'});
    }

}
