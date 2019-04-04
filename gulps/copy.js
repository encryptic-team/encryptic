'use strict';
const merge = require('merge-stream');

/**
 * @file Tasks for copying static files to dist directory.
 * @example gulp copy // Copy static files
 */
module.exports = (gulp, $) => {
    return () => {
        return merge.apply(merge, [
            gulp.src([
                './LICENSE',
            ], {base: './'})
            .pipe(gulp.dest($.distDir)),

            // Copy static files like images, locales, etc...
            gulp.src([
                './src/images/**/*.+(png|jpg|gif|ico|icns)',
                './src/docs/**',
                './src/locales/**/*.json',
                './src/.htaccess',
                './src/*.+(xml|ico|txt|webapp)',
                './src/styles/**/*.+(eot|svg|ttf|woff)',
            ], {base: './src'})
            .pipe(gulp.dest($.distDir)),

            gulp.src([
                './node_modules/openpgp/dist/openpgp.worker.js',
                './node_modules/openpgp/dist/openpgp.js',
            ]).pipe(gulp.dest(`${$.distDir}/scripts`)),

            gulp.src([
                './node_modules/katex/dist/**/*.+(eot|svg|ttf|woff)',
            ], {base: './node_modules/katex/dist'})
            .pipe(gulp.dest(`${$.distDir}/styles`)),

        ]);
    };
};
