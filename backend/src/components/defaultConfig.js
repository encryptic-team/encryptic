var defaultConfig = {
    meta: {
        appVersion          : '1.0.0',
        firstStart          : '1',
        modules             : [],
        debug               : false,
    },
    display: {
        appLang             : '',
        theme               : '',
        version             : '0',
        pagination          : '10',
        sortnotes           : 'created',
        sortnotebooks       : 'name',
        navbarNotebooksMax  : '5',
    },
    editor: {
        editMode            : 'normal',
        textEditor          : 'default',
        indentUnit          : '4',
    },
    sync: {
        localCache          : 'fs',
        cloudStorage        : 'p2p',
        dropboxKey          : '',
        dropboxAccessToken  : '',
    },
    encryption: {
        encrypt             : '0',
        privateKey          : '',
        encryptBackup       : {},
    },
    keybindings: {
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
    },
};

export default defaultConfig;
