'use strict';

/**
 * @file Test related tasks.
 * @example gulp tape // Run Unit tests once
 * @example gulp test:run // Run Unit tests and linters once
 * @example gulp test // Run Unit tests and watch for changes
 * @example gulp cover:run // Generate coverage report once
 * @example gulp cover // Generate coverage report and watch for changes
 * @todo enable lint tests
 */
module.exports = function(gulp, $) {

    gulp.task('tape', $.shell.task([
        'babel-node ./test/tape/index.js | faucet',
    ]));

    gulp.task('tape:debug', $.shell.task([
        'set TAP_DIAG=1 && babel-node ./test/tape/index.js',
    ]));

    gulp.task('test:run', gulp.series('lint', 'tape'));

    gulp.task('test', gulp.series('test:run', () => {
        gulp.watch(['./src/scripts/**/*.js', 'test/tape/**/*.js'], gulp.series('tape'));
    }));

    gulp.task('cover:run', $.shell.task(['npm run cover']));
    gulp.task('cover', gulp.series('cover:run', () => {
        gulp.watch([
            './src/scripts/**/*.js',
            'test/tape/**/*.js',
        ], gulp.series('cover:run'));
    }));

};
