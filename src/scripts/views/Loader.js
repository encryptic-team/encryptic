/**
 * @module views/Loader
 */
import {View} from 'backbone.marionette';
import _ from 'underscore';

/**
 * A view that shows a spining icon.
 *
 * @class
 * @extends Marionette.View
 * @license MPL-2.0
 */
export default class Loader extends View {

    get template() {
        const tmpl = require('../templates/loader.html');
        return _.template(tmpl);
    }

}
