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
            open      : !$.util.env.dev,
            server    : $.util.env.root || $.distDir,
            port      : $.util.env.port || 9001,
            ghostMode : $.util.env.ghostMode !== undefined,
        });

        // Watch for changes in SASS and HTML
        gulp.watch('./src/styles/**/*.less', ['css']);
        gulp.watch('./src/*.html', ['html']);

        // Re-bundle if some new packages were installed
        gulp.watch('package.json', ['bundle']);
    };
};
