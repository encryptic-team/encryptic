const electron = require('electron');

// TODO: reference the config file for this.
port = 9000;

const {app, BrowserWindow} = require('electron');
const Encryptic = require('./server.js')(port);
//const {sigApp, sigServer} = require('./Encryptic-server/server.js');

//Encryptic.on("listening", function () { Encryptic.close(); });

function createWindow () {
    let win = new BrowserWindow({
        width: 925, 
        height: 800,
        backgroundColor: '#8583d8',
        minWidth: 925,
        // everything was working fine without the below line.  Suddenly we needed it.
        // I cannot for the life of me figure out why.
        webPreferences: { nodeIntegration: false }
    });
    //win.loadFile('dist/index.html');
    win.loadURL("http://localhost:" + port);
    win.webContents.openDevTools();
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
