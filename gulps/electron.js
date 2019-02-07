'use strict';
var request = require('request');
var fs = require('fs');
var unzip = require('unzip');
var zip = require('archiver');
var ncp = require('ncp').ncp;

ncp.limit = 16;

module.exports = function(gulp, plugins, pkg) {
    return function() {



        let platforms = [
            'darwin-x64',
            // 'linux-arm',
            'linux-ia32',
            'linux-x64',
            'win32-ia32',
            'win32-x64'
        ];

        const opt = {
            src         : './release/Encryptic',
            packageJson : pkg,
            release     : './release',
            cache       : './.tmp',
            version     : 'v4.0.4',
            packaging   : true,
            platforms,
            platformResources: {
                darwin: {
                    CFBundleDisplayName : pkg.name,
                    CFBundleIdentifier  : pkg.name,
                    CFBundleName        : pkg.name,
                    CFBundleVersion     : pkg.version,
                    icon                : './src/images/icon/icon-512x512.icns',
                },
                win: {
                    'version-string'    : pkg.version,
                    'file-version'      : pkg.version,
                    'product-version'   : pkg.version,
                    icon                : './src/images/icon/icon-120x120.png',
                },
            },
        };

        if (plugins.minimist.platform) {
            platforms = [plugins.minimist.platform];
        }

        for (var i = 0; i < platforms.length; i++) {
            const plat = platforms[i];
            const filename = 'electron-' + opt.version + '-' + plat + ".zip";
            const electronPath = opt.cache + '/' + opt.version + '/';
            const platDir = 'electron-' + opt.version + '-' + plat + '/';
            const filePath = electronPath + filename;
            try {
                fs.mkdirSync(opt.cache);
            }
            catch(err){
                //console.error(err);
            }
            try {
                fs.mkdirSync(electronPath);
            }
            catch(err){
                //console.error(err);
            }
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (!err || err.code === 'ENOENT') {
                    const downloadUrl = 'https://github.com/electron/electron/releases/download/' + opt.version + '/' + filename;
                    console.log('Trying electron at ' + downloadUrl);

                    var getFile = request({
                        url: downloadUrl,
                        method: 'GET',
                        followAllRedirects: true,
                    });
                    var saveStream = getFile.pipe(fs.createWriteStream(filePath));

                    getFile.on('response', (res) => {
                        console.log('Status code: ' + filename + ': ' + res.statusCode);
                    });
                    
                    saveStream.on('finish', () => {
                        var readFile = fs.createReadStream(filePath).pipe(unzip.Extract({ path : electronPath + platDir }));
                        readFile.on('finish', () => {
                            console.log('Finished unzipping: ' + filename);
                            const relDir = './' + opt.release + '/' + opt.version + '/';
                            try {
                                fs.mkdirSync(relDir);
                            }
                            catch(err){
                                //console.error(err);
                            }
                            ncp(opt.cache + '/' + opt.version + '/' + platDir, relDir + plat, (err) => {
                                if (err) {
                                    console.error('Error: ' + filename + ': ' + err);
                                }
                                else {
                                    var targetDir = "";
                                    if (plat === 'darwin-x64') {
                                        targetDir = relDir + plat + '/Electron.app/Contents/Resources/app/';
                                    }
                                    else {
                                        targetDir = relDir + plat + '/resources/app/';
                                    }

                                    ncp(opt.src, targetDir, (err) => {
                                        if (err) {
                                            console.error('Error: ' + filename + ': ' + err);
                                        }
                                        else {
                                            if (plat === 'darwin-x64') {
                                                fs.renameSync(relDir + plat + '/Electron.app', relDir + plat + '/encryptic.app');
                                            }
                                            else if (plat === 'win32-ia32' || plat === 'win32-x64') {
                                                fs.renameSync(relDir + plat + '/electron.exe', relDir + plat + '/encryptic.exe');
                                            }
                                            else {
                                                fs.renameSync(relDir + plat + '/electron', relDir + plat + '/encryptic');
                                            }
                                            
                                            var output = fs.createWriteStream(relDir + '/encryptic-' + plat + '.zip');
                                            var archive = zip('zip');
                                            output.on('close', function () {
                                                console.log('Success: ' + plat + ': ' + archive.pointer() + ' bytes');
                                            });
                                            archive.on('error', (err) => {
                                                console.error('Error: ' + filename + ': ' + err);
                                            });

                                            archive.pipe(output);
                                            archive.directory(relDir + plat, false).pipe(output);
                                            archive.finalize();
                                        }
                                    });
                                }
                            });
                            // TODO: 
                            // mkdir opt.release/opt.version
                            // copy opt.cache to opt.release
                            // for linux/windows:
                            //    copy opt.src to opt.release/opt.version/platDir/resources/app/
                            // for osx:
                            //    copy opt.src to opt.release/opt.version/platDir/
                            // rename executables
                            // something something icons.
                            // zip it all up.
                        });
                    });                  
                }
                else if (err) {
                    console.error('Error: ' + filename + ': ' + err.code);
                }
            });
        }    
        return gulp.src('./electron/electron.js')
    }
}