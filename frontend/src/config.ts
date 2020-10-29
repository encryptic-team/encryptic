export interface Config {
  meta: {
      appVersion          : string,
      firstStart          : string,
      modules             : object,
      debug               : boolean,
  },
  display: {
      appLang             : string,
      theme               : string,
      version             : string,
      pagination          : number,
      sortnotes           : string,
      sortnotebooks       : string,
      navbarNotebooksMax  : number,
  },
  editor: {
      editMode            : string,
      textEditor          : string,
      indentUnit          : number,
  },
  sync: {
      localCache          : string,
      cloudStorage        : string,
      dropboxKey          : string,
      dropboxAccessToken  : string,
  },
  encryption: {
      encrypt             : boolean,
      privateKey          : string,
      encryptBackup       : object,
  },
  keybindings: {
      navigateTop        : string,
      navigateBottom     : string,
      jumpInbox          : string,
      jumpNotebook       : string,
      jumpFavorite       : string,
      jumpRemoved        : string,
      jumpOpenTasks      : string,
      actionsEdit        : string,
      actionsOpen        : string,
      actionsRemove      : string,
      actionsRotateStar  : string,
      appCreateNote      : string,
      appSearch          : string,
      appKeyboardHelp    : string,
      appShowSidemenu    : string
  }
}
