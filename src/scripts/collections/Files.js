/**
 * @module collections/Files
 */
import File from '../models/File';
import BaseCollection from './BaseCollection';

/**
 * File collection.
 *
 * @class
 * @extends module:collections/Collection
 * @license MPL-2.0
 */
export default class Files extends BaseCollection {

    /**
     * File model.
     *
     * @returns {Object}
     */
    get model() {
        return File;
    }

}
