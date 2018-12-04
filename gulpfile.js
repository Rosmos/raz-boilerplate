(function () {

    'use strict';

    var inlineBase64 = require('gulp-inline-base64'),
        autoprefixer = require('gulp-autoprefixer'),
        imagemin     = require('gulp-imagemin'),
        connect      = require('gulp-connect'),
        replace      = require('gulp-replace'),
        sass         = require('gulp-sass'),
        eslint       = require('gulp-eslint'),
        gulp         = require('gulp'),
        fs           = require('fs');


    // ----- Building JS ----- //

    gulp.task('eslint', function () {
        return gulp.src(['_js/**/*.js', '!_js/vendor/*.js'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    });

    gulp.task('build-js-dev', function () {
        return gulp.src(['_js/**/*.js'])
            .pipe(gulp.dest('dist/js'))
            .pipe(connect.reload());
    });

    gulp.task('build-js-dist', ['eslint'], function () {
        return gulp.src(['_js/**/*.js'])
            .pipe(gulp.dest('dist/js'));
    });


    // ----- Building CSS ----- //

    gulp.task('imgoptimize', function () {
        return gulp.src('_images/**/*')
            .pipe(imagemin(
                {
                    progressive: true,
                    svgoPlugins: [
                        {removeViewBox: false},
                        {cleanupIDs: false}
                    ]
                }
            ))
            .pipe(gulp.dest('_images'));
    });

    function buildCss(inputStream) {
        return inputStream
            .pipe(sass({outputStyle: 'expanded'})
                      .on('error', sass.logError))
            .pipe(inlineBase64(
                {
                    debug  : true,
                    baseDir: '_images/',
                    maxSize: 1
                }
            ))
            .pipe(replace('@charset "UTF-8";', ''))
            .pipe(autoprefixer(
                {
                    browsers: ['last 2 versions'],
                    cascade : false
                }
            ));
    }

    gulp.task('build-css-dev', function () {
        return buildCss(gulp.src('_sass/**/*.scss'))
            .pipe(gulp.dest('dist/css'))
            .pipe(connect.reload());
    });

    gulp.task('build-css-dist', function () {
        return buildCss(gulp.src('_sass/**/*.scss'))
            .pipe(gulp.dest('dist/css'));
    });

    //----- Reload -----//

    gulp.task('connect', function () {
        connect.server({
                           root      : 'dist',
                           https     : {
                               key : fs.readFileSync('_cert/localhost.key'),
                               cert: fs.readFileSync('_cert/localhost.crt')
                           },
                           livereload: {
                               enable: true,
                               port  : 8088
                           },
                           host      : 'localhost', // 'local.dev',
                           port      : 8080
                       });
    });


    //----- Use these tasks: -----//

    gulp.task('build', ['build-js-dist', 'build-css-dist', 'imgoptimize']);

    gulp.task('watch', ['build-js-dev', 'build-css-dev', 'connect'], function () {
        gulp.watch('_js/**/*.js', ['build-js-dev']);
        gulp.watch('_sass/**/*.scss', ['build-css-dev']);
    });

    gulp.task('default', ['watch']);


}());


