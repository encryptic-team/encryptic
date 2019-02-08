'use strict';

module.exports = function(gulp, plugins) {

    gulp.task('npm:install', () => {
        return gulp.src('./electron/package.json')
        .pipe(plugins.shell(
            'cd ./electron && npm install --production && cd ../'
        ));
    });

};
