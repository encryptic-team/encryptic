/**
 * @module components/linkDialog/views/Item
 */
import {View} from 'backbone.marionette';
import _ from 'underscore';

/**
 * Link dialog item view.
 *
 * @class
 * @extends Marionette.View
 * @license MPL-2.0
 */
export default class Item extends View {

    get template() {
        const tmpl = require('../templates/item.html');
        return _.template(tmpl);
    }

    get tagName() {
        return 'li';
    }

}
