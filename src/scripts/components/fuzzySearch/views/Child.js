/**
 * @module components/fuzzySearch/views/Child
 */
import {View} from 'backbone.marionette';
import _ from 'underscore';

/**
 * Fuzzy search child view.
 *
 * @class
 * @extends Marionette.View
 * @license MPL-2.0
 */
export default class Child extends View {

    get template() {
        const tmpl = require('../template.html');
        return _.template(tmpl);
    }

    get className() {
        return 'list-group list--group';
    }

    triggers() {
        return {
            'click .list-group-item': 'navigate:search',
        };
    }

}
