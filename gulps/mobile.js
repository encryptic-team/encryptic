'use strict';

const cordova = require('cordova-lib').cordova.raw,
    fs        = require('fs'),
    devip     = require('dev-ip');

module.exports = function(gulp, plug, pkg) {

    /**
     * Use livereload server when debugging.
     */
    function useServer() {
        return plug.replace(
            '<content src="index.html',
            `<content src="http://${devip()[0]}:${(plug.minimist.port || 9000)}`
        );
    }

    gulp.task('mobile:clean', () => {
        return plug.del(['./cordova']);
    });

    gulp.task('mobile:copy', () => {
        return gulp.src(`${plug.distDir}/**/*`, {base: plug.distDir})
        .pipe(gulp.dest('./cordova/www'));
    });

    gulp.task('mobile:config', () => {
        return gulp.src(['./src/config.xml'])
        .pipe(plug.replace('{{version}}', pkg.version))
        .pipe(!plug.minimist.dev ? plug.through2.obj() : useServer())
        .pipe(gulp.dest('./cordova'));
    });

    /**
     * Copy build.json in which one can store keystore configs.
     */
    gulp.task('mobile:buildConfig', () => {
        try {
            fs.statSync('./build.json');
            return gulp.src(['./build.json'])
            .pipe(gulp.dest('./cordova'));
        } catch (e) {
            return plug.through2.obj();
        }
    });

    gulp.task('mobile:replace', () => {
        return gulp.src('./cordova/www/index.html')
        .pipe(plug.replace('<!-- {{cordova}} -->', '<script src="cordova.js"></script>'))
        .pipe(plug.replace(' manifest=\'app.appcache\'', ''))

        // Use different name for debugging
        .pipe(
            plug.minimist.dev ?
                plug.replace('<name>Encryptic', '<name>Encryptic dev') :
                plug.through2.obj()
        )
        .pipe(gulp.dest('./cordova/www'));
    });

    gulp.task('mobile:cordova', () => {
        process.chdir('./cordova');

        return cordova.platform('add', ['android'])
        .then(() => {
            return cordova.plugins('add', [
                'cordova-plugin-crosswalk-webview',
                'cordova-plugin-inappbrowser',
                'cordova-plugin-file',
            ]);
        });
    });

    gulp.task('mobile:create', gulp.series(
        'mobile:clean',
        'build',
        gulp.parallel('mobile:copy', 'mobile:config', 'mobile:buildConfig'),
        'mobile:replace',
        'mobile:cordova'
    ));

    gulp.task('mobile:build', gulp.series('mobile:create', () => {
        return cordova.build({
            platforms: ['android'],
            options  : {
                release: !plug.minimist.dev
            }
        });
    }));

};
