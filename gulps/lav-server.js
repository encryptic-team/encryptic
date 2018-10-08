'use strict';

module.exports = function(gulp, plugins) {

    gulp.task('lav-server', function() {
        return gulp.src('./release')
        .pipe(plugins.shell(
            'cd ./release/Encryptic && curl -o Encryptic-server.tar.gz https://codeload.github.com/daed/Encryptic-server/tar.gz/server-1.0.0 && gzip -d Encryptic-server.tar.gz && tar xvf Encryptic-server.tar && rm -rf Encryptic-server.tar && mv Encryptic-server-server-1.0.0 Encryptic-server && cd ../'
        ));
    });

};
