/**
 * @module collections/Profiles
 */
import BaseCollection from './BaseCollection';
import Profile from '../models/Profile';

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
        console.log('destroyUser(): calling destroyDb()');
        this.sync('destroyDb', opt);
    }

    constructor(models) {
        // Change the profileId to "default"
        super(models, {profileId: 'default'});
    }

}
