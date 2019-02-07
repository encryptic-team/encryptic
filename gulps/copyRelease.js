'use strict';

module.exports = function(gulp) {
    return function() {
        return gulp.src([
            './electron/*.js*',
        ])
        .pipe(gulp.dest('./release/Encryptic'));
    };
};
