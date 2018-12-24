/**
 * @module models/Config
 */
import BaseModel from './BaseModel';

/**
 * Config model.  This is the underlying structure for a single config
 * name->value pair.  For the entire config look at collections/Config.
 *
 * I really think it's strange to have a model for a single key-value pair.
 * Then again, I think it's strange to have a collection for a single
 * instance of a "Config" object.  I'm not sure what to do about this. I
 * think it needs to exist as a model/collection in order to make it into
 * the database, so I think it's a necessary evil.  I'm just not sure
 * if there's a better way of doing it.
 *
 * @class
 * @extends module:models/Model
 * @license MPL-2.0
 */
export default class Config extends BaseModel {

    /**
     * Use name as ID.
     *
     * @returns {String}
     */
    get idAttribute() {
        return 'name';
    }

    /**
     * Default values.
     *
     * @returns {Object}
     */
    get defaults() {
        return {
            name  : '',
            value : '',
        };
    }

    /**
     * Store name.
     *
     * @returns {String}
     */
    get storeName() {
        return 'configs';
    }

    get validateAttributes() {
        return ['name'];
    }

}
