/**
 * @module components/settings/show/sync/remotestorage/View
 */
import _ from 'underscore';
import {View as MnView} from 'backbone.marionette';
import RemoteStorage from 'remotestoragejs';
import Behavior from '../../Behavior';
import Radio from 'backbone.radio';
import deb from 'debug';

const log = deb('lav:components/settings/show/sync/remotestorage/View');

/**
 * Show a list of users whom you trust or invited.
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

    get behaviors() {
        return [Behavior];
    }

    ui() {
        return {
            address   : '#rs-address',
            helpError : '.help--error',
        };
    }

    events() {
        return {
            'click #btn--rs-connect'    : 'connect',
            'click #btn--rs-disconnect' : 'disconnect',
        };
    }

    /**
     * Handle RemoteStorage connection error
     * @param {Object} err Error
     */
    onRSError(err) {
        log('Failed to connect to RS server: ', err);
        this.ui.helpError.text(_.i18n(err.message));
    }

    /**
     * Save address and sync method before redirecting to auth
     */
    onRSAuth() {
        Radio.request('collections/Configs', 'saveConfigs', {
            configs: [
                {name: 'remotestorageAddress', value: this.ui.address.val().trim()},
                {name: 'cloudStorage'        , value: 'remotestorage'},
            ],
        });
    }

    /**
     * Try to connect to the provided RemoteStorage
     */
    connect() {
        this.rs = new RemoteStorage({cache: false});
        this.rs.access.claim('encryptic', 'rw');

        this.rs.on('authing', () => this.onRSAuth());
        this.rs.on('error', err => this.onRSError(err));
        this.rs.on('connected', e => console.log('i', e));

        this.rs.connect(this.ui.address.val().trim());
    }

    /**
	 * Disconnect the RemoteStorage server
	 *
	 * @returns {Promise}
	 */
    async disconnect() {
        await Radio.request('components/sync', 'disconnect');
        this.render();
    }

    serializeData() {
        return {
            rsAddress     : this.collection.get('remotestorageAddress').get('value'),
            isRSAvailable : this.collection.get('remotestorageToken').get('value') !== '',
        };
    }

}
