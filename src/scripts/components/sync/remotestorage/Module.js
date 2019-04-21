/**
 * @module components/sync/remotestorage/Module
 */

/**
 * RemoteStorage module
 *
 * @class
 * @license MPL-2.0
 */
export default {
    name: 'encryptic',

    builder(client) {
        client.declareType('notes', {
            $schema    : 'http://json-schema.org/draft-07/schema#',
            type       : 'object',
            title      : 'Notes',
            properties : {
                id: {
                    type     : 'string',
                    required : true,
                },
                title: {
                    type: 'string',
                },
                content: {
                    type: 'string',
                },
                taskAll: {
                    type: 'number',
                },
                taskCompleted: {
                    type: 'number',
                },
                created: {
                    type: 'number',
                },
                updated: {
                    type: 'number',
                },
                notebookId: {
                    type: 'string',
                },
                tags: {
                    type: 'array',
                },
                isFavorite: {
                    type: 'number',
                },
                trash: {
                    type: 'number',
                },
            },
        });

        client.declareType('notebooks', {
            $schema    : 'http://json-schema.org/draft-07/schema#',
            type       : 'object',
            title      : 'Notebooks',
            properties : {
                id: {
                    type     : 'string',
                    required : true,
                },
                parentId: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
                updated:  {
                    type: 'number',
                },
            },
        });

        client.declareType('tags', {
            $schema    : 'http://json-schema.org/draft-07/schema#',
            type       : 'object',
            title      : 'Tags',
            properties : {
                id: {
                    type     : 'string',
                    required : true,
                },
                name: {
                    type: 'string',
                },
                updated:  {
                    type: 'number',
                },
            },
        });

        return {
            exports: {

                /**
				 * List a directory
				 *
				 * @param {String} path - Path to the directory
				 * @returns {Promise|Array}
				 */
                listDir(path) {
                    return client.getListing(path);
                },

                /**
				 * Get the object stored at path
				 *
				 * @param {String} path - Path to the file
				 * @returns {Promise|Blob}
				 */
                readObject(path) {
                    return client.getObject(path);
                },

                /**
				 * Save a Backbone model on the RemoteStorage server
				 *
				 * @param {String} path - Path where to save the object
				 * @param {Object} model - The model to save
				 * @returns {Promise}
				 */
                saveModel(path, type, model) {
                    return client.storeObject(
                        type,
                        path,
                        model
                    );
                },
            },
        };
    },
};
