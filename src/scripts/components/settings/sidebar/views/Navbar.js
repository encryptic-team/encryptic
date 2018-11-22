/**
 * @module components/settings/sidebar/Navbar
 */
import {View} from 'backbone.marionette';
import _ from 'underscore';

/**
 * Settings navbar view for the sidebar.
 *
 * @class
 * @extends Marionette.View
 * @license MPL-2.0
 */
export default class Navbar extends View {

    get template() {
        const tmpl = require('../templates/navbar.html');
        return _.template(tmpl);
    }

}
