/**
 * @module components/settings/show/sync/dropbox/View
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
        // eslint-disable-next-line max-len
        // https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=hlicys9cs8rj3ep&redirect_uri=http://localhost:9000/sync.html

        // modified to account for users running hosted as a node server.
        let url;

        if (navigator.userAgent.indexOf('Electron') !== -1 ||
            document.location.host.includes('localhost:9000')) {

            url = 'http://localhost:9000/auth.html';
        }
        else {
            url = `https://${document.location.host}/auth.html`;
        }

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
