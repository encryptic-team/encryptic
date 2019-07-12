const {Menu} = require('electron'),
    path = require('path');

const windowStateKeeper = require('electron-window-state');
const {app, BrowserWindow} = require('electron');
const http         = require('http');
const serveStatic  = require('serve-static');
const finalHandler = require('finalhandler');
const shell        = require('electron').shell;
let win;

const port = 9000;
const serve = serveStatic(`${__dirname}/dist`, {index: ['index.html']});
const server = http.createServer((req, res) => {
    serve(req, res, finalHandler(req, res));
});
server.listen(port);

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
                label       : 'Back',
                accelerator : 'CmdOrCtrl+B',
                click       : () => {
                    if (win.webContents.canGoBack()) {
                        win.webContents.goBack();
                    }
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

    win.webContents.on('will-navigate', (event, url) => {
        if (!url.startsWith('https://localhost') && !url.startsWith('http://localhost'))
        {
            event.preventDefault();
            shell.openExternal(url);
            /*
            nb = new BrowserWindow();
            nb.on('closed', () => nb = null);
            nb.loadURL(url);
            */
        }
    });


    win.on('closed', () => win = null);

    // eslint-disable-next-line max-len
    // this kills dropbox: redirect_uri=file:///home/brad/src/encryptic/release/Encryptic-0.0.3-linux-x64/resources/app/dist/index.html
    // dropbox HAS to have http
    // win.loadFile('./dist/index.html');

    win.loadURL(`http://localhost:${port}`);
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    app.quit();
});
