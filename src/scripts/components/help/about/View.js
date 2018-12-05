/**
 * @module components/help/about/View
 */
import {View as MnView} from 'backbone.marionette';
import _ from 'underscore';

/**
 * About view.
 *
 * @class
 * @extends Marionette.View
 * @license MPL-2.0
 */
export default class View extends MnView {

    get template() {
        const tmpl = require('./template.html');
        return _.template(tmpl);
    }

    get className() {
        return 'modal fade';
    }

    serializeData() {
        return this.options;
    }

}
