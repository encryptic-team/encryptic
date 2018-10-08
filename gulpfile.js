'use strict';

/**
 * @file Gulp tasks.
 * @example gulp // Default task. Builds and serves the app.
 * @example gulp build --distDir='~/Encryptic-dist' // To build the project and
 * place it in ~/Encryptic-dist folder.
 */
const gulp = require('gulp'),
    pkg    = require('./package.json'),
    $      = require('gulp-load-plugins')();

$.del         = require('del');
$.browserSync = require('browser-sync').create();
$.distDir     = $.util.env.distDir || './dist';

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

gulp.task('release:after', () => {
    return gulp.src('./release')
    .pipe($.shell([
        'cd ./release && zip -r ../release/webapp.zip ./Encryptic',
    ]));
});

/**
 * Build the app.
 * ``gulp build --dev`` to build without minifying.
 */
gulp.task('build', $.sequence(
    'clean:dist',
    ['bundle', 'copy', 'css', 'html']
));

/**
 * Prepare the release files.
 */
gulp.task('release', $.sequence(
    'clean:release',
    'copyDist', 
    'copyRelease',
    'npm:install',
    'electron'
));

/**
 * Build for android
 */
gulp.task('release-mobile', $.sequence(
    'clean:release',
    ['copyDist', 'copyRelease'],
    'npm:install',
	'mobile:build'
));

/**
 * Gulp server.
 * ``gulp --root dist`` to serve dist folder.
 */
gulp.task('default', $.sequence('build', 'serve'));
