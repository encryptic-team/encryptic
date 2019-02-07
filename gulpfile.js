'use strict';

/**
 * @file Gulp tasks.
 * @example gulp // Default task. Builds and serves the app.
 * @example gulp build --distDir='~/Encryptic-dist' // To build the project and
 * place it in ~/Encryptic-dist folder.
 */
const gulp          = require('gulp'),
    pkg             = require('./package.json'),
    gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins({
    pattern         : ['del', 'through2'],
    overridePattern : false,
});

$.browserSync = require('browser-sync').create();
$.minimist    = require('minimist')(process.argv.slice(2));
$.distDir     = $.minimist.distDir || './dist';

/**
 * Create a new Gulp task.
 *
 * @param {String} name - name of the task file
 */
function createTask(name) {
    const task = require(`./gulps/${name}`)(gulp, $, pkg);

    if (typeof task === 'function') {
        gulp.task(name, task);
    }
}

// Load and create tasks
[
    'bundle',
    'clean',
    'css',
    'electron',
    'html',
    'lint',
    'npm',
    'serve',
    'test',
    'copy',
    'copyDist',
    'copyRelease',
].forEach(createTask);

/**
 * Build the app.
 * `gulp build --dev` to build without minifying.
 */
gulp.task('build', gulp.series(
    'clean:dist',
    gulp.parallel('bundle', 'copy', 'css', 'html')
));

// Load mobile tasks
createTask('mobile');

// Prepare the release files.
gulp.task('release', gulp.series(
    'build',
    'clean:release',
    'copyDist', 
    'copyRelease',
    'npm:install',
    'electron'
));

// Build for android
gulp.task('release-mobile', gulp.series(
    'clean:release',
    gulp.parallel('copyDist', 'copyRelease'),
    'npm:install',
    'mobile:build'
));

/**
 * Gulp server.
 * ``gulp --root dist`` to serve dist folder.
 */
gulp.task('default', gulp.series('build', 'serve'));
