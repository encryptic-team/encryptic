const {Menu} = require('electron'),
    path = require('path');

const windowStateKeeper = require('electron-window-state');
const {app, BrowserWindow} = require('electron');
let win;

const menuTemplate = [
    {
        label   : '&File',
        submenu : [
            {
                label       : 'Quit',
                accelerator : 'CmdOrCtrl+Q',
                click       : () => app.quit(),
            },
        ],
    },
    {
        label   : '&Edit',
        submenu : [
            {type: 'separator'},
            {
                label       : 'Cut',
                accelerator : 'CmdOrCtrl+X',
                role        : 'cut',
            },
            {
                label       : 'Copy',
                accelerator : 'CmdOrCtrl+C',
                role        : 'copy',
            },
            {
                label       : 'Paste',
                accelerator : 'CmdOrCtrl+V',
                role        : 'paste',
            },
            {type: 'separator'},
            {
                label       : 'Select All',
                accelerator : 'CmdOrCtrl+A',
                role        : 'selectall',
            },
        ],
    },
    {
        label   : '&Debug',
        submenu : [
            {
                label       : 'Reload',
                accelerator : 'CmdOrCtrl+R',
                click       : () => {
                    if (win)
                        win.reload();
                },
            },
            {
                label       : 'Toggle Developer Tools',
                accelerator :
                    process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',

                click       : () => {
                    if (win)
                        win.webContents.toggleDevTools();
                },
            },
        ],
    },
];

function createWindow() {
    const mainWindowState = windowStateKeeper({
        defaultWidth  : 1000,
        defaultHeight : 800,
    });

    win = new BrowserWindow({
        // This is managed by electron-window-state
        x      : mainWindowState.x,
        y      : mainWindowState.y,
        width  : mainWindowState.width,
        height : mainWindowState.height,

        backgroundColor : '#3e3bba',
        minWidth        : 320,
        minHeight       : 300,
        autoHideMenuBar : true,
        icon            : path.join(__dirname, '/dist/images/icon/',
            process.platform === 'darwin' ? 'IconMenubarTemplate.png' : 'icon.png'
        ),
    });

    mainWindowState.manage(win);
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

    win.on('closed', () => win = null);

    win.loadFile('./dist/index.html');
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    app.quit();
});
