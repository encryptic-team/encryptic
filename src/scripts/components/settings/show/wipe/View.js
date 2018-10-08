/**
 * @module components/settings/show/encryption/View
 */
import Mn from 'backbone.marionette';
import _ from 'underscore';
import Radio from 'backbone.radio';

import Behavior from '../Behavior';

/**
 * Encryption settings view.
 *
 * @todo implement encryption settings
 * @class
 * @extends Marionette.View
 * @license MPL-2.0
 */
export default class View extends Mn.View {

    get template() {
        const tmpl = require('./template.html');
        return _.template(tmpl);
    }

    /**
     * Behaviors.
     *
     * @see module:components/settings/show/Behavior
     * @returns {Array}
     */
    get behaviors() {
        return [Behavior];
    }

    ui() {
        return {
            doWipe: '#doWipe',
        };
    }

    events() {
        return {
            'click #btn--wipe' : 'doWipeAllData',
        };
    }

    collectionEvents() {
        return {
            change: 'render',
        };
    }

    initialize() {
        this.user = Radio.request('collections/Profiles', 'getUser');
    }

    /**
     * Ask a user if they are sure they want to disable encryption.
     */
    async doWipeAllData() {
        // Don't show the confirmation dialog if a user is enabling encryption
        const answer = await Radio.request('components/confirm', 'show', {
            content: _.i18n('Remove ALL of this user\'s data from this device and return to login screen?'),
        });

        if (answer === 'reject') {
            // noop
            Function.prototype();
        }
        else {
            // nuke data here
            console.log('doWipeAllData() confirmed...');
            window.location.replace('/');
            Radio.request('collections/Profiles', 'destroyProfile', this.user.id);

        }
    }
}