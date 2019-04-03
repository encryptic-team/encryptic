'use strict';

/**
 * @file Create HTML related tasks.
 *
 * @example gulp html // copy and minify HTML files
 * @example gulp html:manifest:create // create HTML manifest file (caching)
 * @example gulp:manifest // create manifest and reference to it from files
 */
module.exports = function(gulp, $) {
    gulp.task('html', () => {
        return gulp.src('./src/*.html')
        .pipe(!$.minimist.prod ? $.through2.obj() : $.htmlmin({
            collapseWhitespace : true,
            quoteCharacter     : '\'',
        }))
        .pipe(gulp.dest($.distDir))
        .pipe($.browserSync.stream());
    });

    gulp.task('html:manifest:create', () => {
        // Don't generate manifest for Electron app
        if ($.minimist.electron) {
            return $.through2.obj();
        }

        return gulp.src([
            `${$.distDir}/**`,
        ])
        .pipe($.manifest({
            hash         : true,
            preferOnline : true,
            network      : ['*'],
            filename     : 'app.appcache',
            exclude      : [
                'app.appcache',
                'dropbox.html',
            ],
            timestamp    : true,
            master       : ['index.html'],
            fallback     : ['/ 404.html'],
        }))
        .pipe(gulp.dest($.distDir));
    });

    gulp.task('html:manifest', gulp.series('html:manifest:create', () => {
        const htmlStr  = '<html class="no-js">';
        const manifest = '<html manifest="app.appcache" class="no-js">';

        return gulp.src(`${$.distDir}/*.html`)
        .pipe($.minimist.electron ? $.through2.obj() : $.replace(htmlStr, manifest))
        .pipe(gulp.dest($.distDir));
    }));
};
