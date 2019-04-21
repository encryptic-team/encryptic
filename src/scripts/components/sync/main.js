/**
 * @module components/sync/main
 * @license MPL-2.0
 */
import Radio from 'backbone.radio';
import Sync from './Sync';
import {default as RsView} from '../settings/show/sync/remotestorage/View';
import {default as DbxView} from '../settings/show/sync/dropbox/View';

export default function initialize() {
    Radio.channel('sync/remotestorage').reply({getSettingsView: () => RsView});
    Radio.channel('sync/dropbox').reply({getSettingsView: () => DbxView});

    const sync = Radio.request('collections/Configs', 'findConfig', {
        name: 'cloudStorage',
    });

    if (sync !== 'p2p') {
        return new Sync(sync).init();
    }
}

Radio.once('App', 'start', initialize);
