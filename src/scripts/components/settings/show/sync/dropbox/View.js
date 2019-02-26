/**
 * @module components/dropbox/show/settings/View
 */
import _ from 'underscore';
import {View as MnView} from 'backbone.marionette';
import constants from '../../../../../constants';
import {Dropbox} from 'dropbox';
import Behavior from '../../Behavior';

/**
 * Show a list of users whom you trust or invited.
 *
 * @class
 * @extends Marionette.View
 * @license MPL-2.0
 */
export default class Users extends MnView {

    /**
     * Behaviors.
     *
     * @see module:components/settings/show/Behavior
     * @returns {Array}
     */
    get behaviors() {
        return [Behavior];
    }
    
    get template() {
        const tmpl = require('./template.html');
        return _.template(tmpl);
    }

    get dropboxKeyNeed() {
        return constants.dropboxKeyNeed;
    }

    get authUrl() {
        const url = navigator.userAgent.indexOf('Electron') !== -1 ? 'http://localhost:9000/' : document.location;
        const dbx  = new Dropbox({clientId: constants.dropboxKey});
        return dbx.getAuthenticationUrl(url);
    }

    serializeData() {
        return {
            authUrl         : this.authUrl,
            dropboxAccessToken  : this.collection.get('dropboxAccessToken').get('value'),
            placeholder : this.dropboxKeyNeed ? 'Required' : 'Optional',
        };
    }

}
