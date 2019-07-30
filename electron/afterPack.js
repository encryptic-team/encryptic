'use strict';
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

exports.default = context => {

    function rename(old, newName) {
        console.log('  • moving          ' + old + ' => ' + newName);  
        fs.rename(old, newName, (error) => { if (error) console.log(error) } );
    };
    let x;
    for(x in context.artifactPaths)
    {
        const name = context.artifactPaths[x];
        if (name.includes('-mac.zip')) {
            continue;
        }
        else if (name.includes('-ia32-win.zip')) {
            continue;
        }
        else if (name.includes('-win.zip')) {
            const newName = name.replace('-win.zip', '-x64-win.zip');
            rename(name, newName);
        }
        else if (name.includes('-ia32.zip')) {
            const newName = name.replace('-ia32.zip', '-ia32-linux.zip');
            rename(name, newName);
        }
        else {
            const newName = name.replace('.zip', '-x64-linux.zip');
            rename(name, newName);
        }
    }

    fs.readFile('package.json', (err, data) => {
        let pkgconf = JSON.parse(data);
        let ver = pkgconf.version;
        let zipFile = '../release/Encryptic-' + ver + "-web.zip";
        var output = fs.createWriteStream(zipFile)
        var archive = archiver('zip');
        output.on('close', () => {
            console.log('  • created         distributable zip at ' + zipFile);
        });
        archive.on('error', err => {
            console.error(err);
        });
        archive.pipe(output);
        archive.directory('dist/', 'dist');
        archive.finalize();
    });

}