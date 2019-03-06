'use strict';
const request = require('request');
const fs = require('fs');
const unzip = require('unzip');
const path = require('path');
const { execSync } = require('child_process');

const opt = {
    version     : '4.0.4',
    package     : true,
    platforms   : [
        'darwin-x64',
        'linux-ia32',
        'linux-x64',
        'win32-ia32',
        'win32-x64',
    ],
    icons: {
        darwin : './src/images/icon/icon-512x512.icns',
        win    : './src/images/icon/icon-120x120.png',
    },
};

/**
 * @file Package electron app
 * @example gulp electron
 */
module.exports = function(gulp, plugins, pkg) {

    function packElectron(electronPath, plat, resolve) {
        const releaseDir = `./release/Encryptic-${pkg.version}-${plat}`;

        fs.createReadStream(`${electronPath}.zip`)
        .pipe(unzip.Extract({path: electronPath}))
        .on('finish', () => {
            // the 'recursive' option fails on node < 10.12
            try {
                fs.mkdirSync('./release');
            }
            catch(err) {
                if (err.code != 'EEXIST')
                {
                    console.error(err);
                }
            }
            try {
                fs.mkdirSync(releaseDir);
            }
            catch(err) {
                if (err.code != 'EEXIST')
                {
                    console.error(err);
                }
            }
            gulp.src(`${electronPath}/**`)
            .pipe(gulp.dest(releaseDir))
            .on('finish', () => {
                let targetDir = `${releaseDir}/resources/app/`;
                if (plat === 'darwin-x64') {
                    targetDir = `${releaseDir}/Electron.app/Contents/Resources/app/`;
                }

                plugins.del(electronPath);

                gulp.src('./electron/**')
                .pipe(gulp.dest(targetDir))
                .on('finish', () => {
                    if (plat === 'darwin-x64') {
                        // osx has to be hard
                        const path = `${releaseDir}/encryptic.app`;
                        rmEntireDir(path);
                        execSync(`mv ${releaseDir}/Electron.app ${path}`);
                        //fs.renameSync(`${releaseDir}/Electron.app`, path);
                        fs.chmodSync(`${releaseDir}/encryptic.app/Contents/MacOS/Electron`, '0755');
                    }
                    else if (plat === 'win32-ia32' || plat === 'win32-x64') {
                        fs.renameSync(`${releaseDir}/electron.exe`,
                            `${releaseDir}/encryptic.exe`);
                    }
                    else {
                        fs.renameSync(`${releaseDir}/electron`,
                            `${releaseDir}/encryptic`);
                        fs.chmodSync(`${releaseDir}/encryptic`, '0755');
                    }

                    if (!opt.package) {
                        resolve();
                        return;
                    }

                    gulp.src(`${releaseDir}/**`)
                    .pipe(plugins.zip(`Encryptic-${pkg.version}-${plat}.zip`))
                    .pipe(gulp.dest('./release'))
                    .on('finish', resolve);
                });
            });
        });
    }

    return function() {
        try {
            fs.mkdirSync(`./.tmp/${opt.version}/`, {recursive: true});
        }
        catch(err) {
            if (err.code != 'EEXIST')
            {
                console.error(err);
            }
        }

        if (plugins.minimist.platform)
            opt.platforms = [plugins.minimist.platform];

        const promises = [];
        for (let i = 0; i < opt.platforms.length; ++i) {
            promises[i] = new Promise(resolve => {
                const plat = opt.platforms[i];
                const electronName = `electron-v${opt.version}-${plat}`;
                const electronPath = `./.tmp/${opt.version}/${electronName}`;

                fs.stat(`${electronPath}.zip`, err => {
                    if (err) {
                        console.log(`Downloading ${electronName}`);

                        request({
                            // eslint-disable-next-line max-len
                            url                : `https://github.com/electron/electron/releases/download/v${opt.version}/${electronName}.zip`,
                            followAllRedirects : true,
                        })
                        .pipe(fs.createWriteStream(`${electronPath}.zip`))
                        .on('response', res => {
                            if (res.statusCode !== 200) {
                                console.error(`Error downloading ${electronName}`);
                                resolve();
                            }
                        })
                        .on('finish', () => {
                            console.log(`Finished downloading ${electronName}`);
                            packElectron(electronPath, plat, resolve);
                        });

                        return;
                    }

                    packElectron(electronPath, plat, resolve);
                });
            });
        }

        return Promise.all(promises);
    };

    function rmEntireDir(dir_path) {
        if (fs.existsSync(dir_path)) {
            fs.readdirSync(dir_path).forEach(function(entry) {
                var entry_path = path.join(dir_path, entry);
                if (fs.lstatSync(entry_path).isDirectory()) {
                    rmEntireDir(entry_path);
                } else {
                    fs.unlinkSync(entry_path);
                }
            });
            fs.rmdirSync(dir_path);
        }
    }
    
};