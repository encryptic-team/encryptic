/**
 * @module components/importExport/main
 * @license MPL-2.0
 */
import Radio from 'backbone.radio';
import Import from './Import';
import ImportEvernote from './ImportEvernote';
import Export from './Export';
import Migrate from './migrate/Controller';

function initialize() {
    Radio.channel('components/importExport')
    .reply({
        import         : (...args) => new Import(...args).init(),
        importEvernote : (...args) => new ImportEvernote(...args).init(),
        export         : (...args) => new Export(...args).init(),
    });

    /* Disable login migration check to be in line with issue #58
    Radio.request('utils/Initializer', 'add', {
        name     : 'App:last',
        callback : () => new Migrate().init(),
    });
    */
}

Radio.once('App', 'init', initialize);
export default initialize;
