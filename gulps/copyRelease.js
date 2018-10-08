'use strict';

module.exports = function(gulp, plugins) {
    return function() {
        /*return gulp.src([
            './preload.js',
            './server.js',
            './electron.js',
            './package-lock.json',
            './npm-shrinkwrap.json',
            './package.json',
        ], {base: './'})
        .pipe(gulp.dest('./release/Encryptic'));*/
        return gulp.src([
            './release',
        ])
        .pipe(plugins.shell(
            'cp ./electron/electron.js ./electron/package-lock.json ./electron/package.json ./electron/server.js release/Encryptic'
        ));
    };
};
