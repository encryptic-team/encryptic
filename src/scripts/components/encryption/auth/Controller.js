/**
 * @module components/encryption/auth/Controller
 */
import {MnObject} from 'backbone.marionette';
import Radio from 'backbone.radio';
import View from './View';
import deb from 'debug';

const log = deb('lav:components/encryption/auth/Controller');

/**
 * Auth controller.
 *
 * @class
 * @extends Marionette.Object
 * @license MPL-2.0
 */
export default class Controller extends MnObject {

    /**
     * App settings.
     *
     * @prop {Object}
     */
    get configs() {
        return Radio.request('collections/Configs', 'findConfigs');
    }

    onDestroy() {
        log('destroy');
    }

    /**
     * Ask a user for their encryption password.
     *
     * @returns {Promise} resolved once auth is successful
     */
    init() {
        return new Promise((resolve, reject) => {
            this.promise = {resolve, reject};
            // why?  -ba
            this.fetchShow();
        });
    }

    /**
     * Fetch profiles and show the auth view.
     *
     * @returns {Promise}
     */
    fetchShow() {
        return Radio.request('collections/Profiles', 'find')
        .then(profiles => {
            this.profiles = profiles;
            this.show();
        })
        .catch(err => log('error', err));
    }

    /**
     * Render the view.
     */
    show() {
        // this is insane.  No.  -ba
        // log('profiles', this.profiles);
        this.view = new View({profiles: this.profiles});
        Radio.request('Layout', 'show', {
            region : 'brand',
            view   : this.view,
        });

        this.view.triggerMethod('ready');
        this.listenToEvents();
    }

    /**
     * Start listening to events.
     */
    listenToEvents() {
        this.listenTo(this.view, 'destroy', this.onViewDestroy);
        this.listenTo(this.view, 'submit', this.onSubmit);
        this.listenTo(this.view, 'setup', this.onSetup);
    }

    /**
     * Stop listening to view events.
     */
    onViewDestroy() {
        this.stopListening(this.view);
    }

    /**
     * Try to read the keys and decrypt the private key.
     *
     * @returns {Promise}
     */
    onSubmit() {
        const passphrase = this.view.ui.password.val().trim();
        const username   = this.view.ui.username.val().trim();

        Radio.request('collections/Profiles', 'setUser', {username});
        //Radio.request('components/Encryption', 'readKeys', {passphrase})
        return Radio.request('components/Encryption', 'readKeys', {passphrase})
        // Fetch a user's configs
        .then(() => {
            // console.log("find()");
            Radio.request('collections/Configs', 'find', {profileId: username});
        })
        .then(() => {
            this.onSuccess()
        })
        .catch(error => {
            log('readKeys error', error);
            this.view.triggerMethod('auth:error', {error});
            return (error);
        });
    }

    /**
     * Show the setup form to register a new account.
     *
     * @returns {Promise}
     */
    async onSetup() {
        await Radio.request('components/setup', 'start', {newIdentity: true});
        this.fetchShow();
    }

    /**
     * Resolve the promise and destroy the view.
     */
    onSuccess() {
        this.promise.resolve();
        this.view.destroy();
        return true;
    }

}
