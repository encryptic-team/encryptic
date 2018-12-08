'use strict';

/**
 * @file Live reload server.
 *
 * @example gulp serve // Starts live-reload server
 */
module.exports = (gulp, $) => {
    return () => {
        $.browserSync.init({
            notify    : false,
            open      : !$.minimist.dev,
            server    : $.minimist.root || $.distDir,
            port      : $.minimist.port || 9000,
            ghostMode : $.minimist.ghostMode !== undefined,
        });

        // Watch for changes in SASS and HTML
        gulp.watch('./src/styles/**/*.less', gulp.series('css'));
        gulp.watch('./src/*.html', gulp.series('html'));

        // Re-bundle if some new packages were installed
        gulp.watch('package.json', gulp.series('bundle'));
    };
};
