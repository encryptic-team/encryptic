/**
 * @module components/sync/main
 * @license MPL-2.0
 */
import Radio from 'backbone.radio';
import Sync from './Sync';
import {default as RsView} from '../settings/show/sync/remotestorage/View';

export default function initialize() {
    Radio.channel('components/remotestorage').reply({getSettingsView: () => RsView});

    const sync = Radio.request('collections/Configs', 'findConfig', {
        name: 'cloudStorage',
    });

    if (sync === 'remotestorage') {
        return new Sync(sync).init();
    }
}

Radio.once('App', 'start', initialize);
