const electron = require('electron');
const {Menu} = require('electron')
// TODO: reference a config file for this.
port = 9000;

const windowStateKeeper = require('electron-window-state');
const {app, BrowserWindow} = require('electron');
const Encryptic = require('./server.js')(port);
//const {sigApp, sigServer} = require('./Encryptic-server/server.js');
let win;

const menu_template = [
    {
        lavel: 'debug',
        submenu : [ 
        {
            label: 'show dev tools',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click (item, focusedWindow) {
                if (focusedWindow) focusedWindow.webContents.toggleDevTools()
            }
        }]
    }
]

function createWindow () {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800
    });

    win = new BrowserWindow({
        // This is managed now by electron-window-state
        //width: 925, 
        //height: 800,
        // electron-window-state managed vars below
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,

        backgroundColor: '#8583d8',
        minWidth: 925,
        // everything was working fine without the below line.  Suddenly we needed it.
        // I cannot for the life of me figure out why.
        webPreferences: { nodeIntegration: false }
    });

    mainWindowState.manage(win);
    win.loadURL("http://localhost:" + port);
    
    const menu = Menu.buildFromTemplate(menu_template);
    Menu.setApplicationMenu(menu);

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        Encryptic.close();
        //sigServer.close();
        //sigApp.quit();
        win = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    app.quit();
});
