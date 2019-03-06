'use strict';

/**
 * @file Live reload server.
 *
 * @example gulp serve // Starts live-reload server
 */
module.exports = (gulp, $) => {
    return () => {
        return new Promise((_, reject) => {
            const port = $.minimist.port || 9000;

            // why is this SO HUGGING HARD to just add something like
            // instance.options.url or just an option to abort if the port is in use ?
            $.browserSync.init({
                port,
                notify    : false,
                open      : false,
                server    : $.minimist.root || $.distDir,
                ghostMode : $.minimist.ghostMode !== undefined,
            }, function() {
                if (this.server.address().port !== port) {
                    reject('[ERROR] Could not serve: port 9000 is in use.');
                }

                if (!$.minimist.dev) {
                    this.utils.openBrowser(
                        this.options.get('urls').toJS().local,
                        this.options.set('open', true),
                        this
                    );
                }

                // Watch for changes in SASS and HTML
                gulp.watch('./src/styles/**/*.less', gulp.series('css'));
                gulp.watch('./src/*.html', gulp.series('html'));

                // Re-bundle if some new packages were installed
                gulp.watch('package.json', gulp.series('bundle'));
            });
        });
    };
};
