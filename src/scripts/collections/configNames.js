import _ from 'underscore';

/**
 * Default config values.
 *
 * @namespace
 * @prop {String} appVersion - version of the app
 * @prop {String} firstStart - always equal to 1 until a user goes through
 * first-start tutorial.
 * @prop {Array} modules - an array of enabled modules
 * @license MPL-2.0
 */
const configNames = {
    appVersion         : '1.0.0',
    firstStart         : '1',
    modules            : [],

    /**
     * Main configs.
     *
     * @prop {String} appLang - localization (en|fr...etc)
     * @prop {String} theme - theme
     * @prop {String} version - 0 is fully local, 1 is byos, 2 is fully hosted
     * @prop {String} pagination - the number of notes shown per page
     * @prop {String} sortnotes - key by which notes should be sorted
     * @prop {String} sortnotebooks - key by which notebooks should be sorted
     * @prop {String} navbarNotebooksMax - the maximum amount of notebooks shown
     * in the navbar
     */
    appLang            : '',
    theme              : '',

    version            : '0',
    pagination         : '10',
    sortnotes          : 'created',
    sortnotebooks      : 'name',
    navbarNotebooksMax : '5',

    /**
     * Codemirror settings.
     *
     * @prop {String} editMode - (normal|fullscreen|preview)
     * @prop {String} textEditor - keybindings used for the editor (vim|emacs|sublime)
     * @prop {String} indentUnit - number of spaces used for indentation
     */
    editMode           : 'preview',
    textEditor         : 'default',
    indentUnit         : '4',

    /**
     * Synchronization settings.
     *
     * @prop {String} signalServer
     * @prop {String} deviceId - unique device ID
     * @prop {Array}  peers    - an array of peers. Every item in the array
     * has the following structure {username, deviceId, lastSeen}
     * @prop {String} cloudStorage - (p2p|dropbox|remotestorage)
     * @prop {String} dropboxKey - dropbox app key
     * @prop {String} dropboxAccessToken - dropbox access token
     * @prop {String} folderPath - the path to your data storage directory
     */
    signalServer       : 'http://localhost:3000',
    deviceId           : '',
    peers              : [],
    cloudStorage       : 'p2p',
    dropboxKey         : '',
    dropboxAccessToken : '',
    folderPath        : '',

    /**
     * Encryption settings.
     *
     * @prop {String} encrypt - disable/enable encryption (0|1)
     * @prop {Object} encryptBackup - used for storing the previous encryption
     * settings.
     */
    encrypt       : '0',
    encryptBackup : {},
    /**
     * Keybinding settings.
     *
     * @prop {String} navigateTop - previous item (default k)
     * @prop {String} navigateBottom - next item (default k)
     * @prop {String} jumpInbox - go to the index page (default g+i)
     * @prop {String} jumpNotebok - go to the notebook page (default g+n)
     * @prop {String} jumpFavorite - go to the favorite page (default g+f)
     * @prop {String} jumpRemoved - go to the trash page (default g+t)
     * @prop {String} jumpOpenTasks - show all notes that have tasks (default g+o)
     * @prop {String} actionsEdit - edit selected note/notebook/tag (default e)
     * @prop {String} actionsOpen - open selected note/notebook/tag (default o)
     * @prop {String} actionsRotateStar - toggle favorite status of a note - s
     * @prop {String} appCreateNote - create a new note/notebook/tag (default c)
     * @prop {String} appSearch - show search box (default /)
     * @prop {String} appKeyboardHelp - show keybinding help (default ?)
     */
    navigateTop        : 'k',
    navigateBottom     : 'j',
    jumpInbox          : 'g i',
    jumpNotebook       : 'g n',
    jumpFavorite       : 'g f',
    jumpRemoved        : 'g t',
    jumpOpenTasks      : 'g o',
    actionsEdit        : 'e',
    actionsOpen        : 'o',
    actionsRemove      : 'shift+3',
    actionsRotateStar  : 's',
    appCreateNote      : 'c',
    appSearch          : '/',
    appKeyboardHelp    : '?',
    appShowSidemenu    : 's m',
};

export {configNames};
