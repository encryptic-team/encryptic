/**
 * @module components/fuzzySearch/views/View
 */
import {CollectionView} from 'backbone.marionette';
import Child from './Child';

/**
 * Fuzzy search collection view.
 *
 * @class
 * @extends Marionette.CollectionView
 * @license MPL-2.0
 */
export default class View extends CollectionView {

    get className() {
        return 'main notes-list';
    }

    /**
     * Child view.
     *
     * @see module:components/fuzzySearch/views/Child
     * @prop {Object}
     */
    get childView() {
        return Child;
    }

    /**
     * @todo
     */
    get emptyView() {
    }

    childViewTriggers() {
        return {
            'navigate:search': 'childview:navigate:search',
        };
    }

}
