/**
 * @module components/share/Info
 */
import _ from 'underscore';
import {View} from 'backbone.marionette';

/**
 * Show information about a user.
 *
 * @class
 * @extends Marionette.View
 * @license MPL-2.0
 */
export default class Info extends View {

    get template() {
        const tmpl = require('./template.html');
        return _.template(tmpl);
    }

    triggers() {
        return {
            'click .share--trust': 'add:trust',
        };
    }

    serializeData() {
        return this.options;
    }

}
