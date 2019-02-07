'use strict';

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

        if (plugins.minimist.platform) {
            platforms = [plugins.minimist.platform];
        }

        return gulp.src('./electron/electron.js')
        .pipe(plugins.electron({
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
        }));
    };
};
