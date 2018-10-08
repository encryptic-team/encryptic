'use strict';

module.exports = function(gulp, plugins) {

    gulp.task('npm:install', function() {
        return gulp.src('./release/Encryptic/package.json')
        .pipe(plugins.shell(
            'cd ./release/Encryptic && npm install --production && cd ../../'
        ));
    });

};
