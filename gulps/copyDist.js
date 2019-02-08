'use strict';

module.exports = function(gulp) {
    return function() {
        return gulp.src('./dist/**')
        .pipe(gulp.dest('./electron/dist'));
    };
};

