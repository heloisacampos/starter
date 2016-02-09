'use strict';

/*===============================
=            Loaders            =
===============================*/
var gulp        = require('gulp'),
    compass     = require('gulp-compass'),
    jshint      = require('gulp-jshint'),
    jslint      = require('gulp-jslint'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    clean       = require('gulp-dest-clean'),
    usemin      = require('gulp-usemin'),
    htmlmin     = require('gulp-htmlmin'),
    minifyCss   = require('gulp-minify-css'),
    replace     = require('gulp-replace'),
    uglify      = require('gulp-uglify');
/*=====  End of Loaders  ======*/


/*==================================
=            References            =
==================================*/
var dev  = './dev/',
    dist = './dist/',

    gulpFile       = 'gulpfile.js',
    htmlFiles      = dev + '**/*.html',
    jsFiles        = dev + 'scritps/**/*.js',
    scssFiles      = dev + 'styles/scss/**/*.scss',
    renderersFiles = dev + 'styles/scss/renderers/**/*.scss',
    cssFiles       = dev + 'styles/css/**/*.css',

    scssFolder  = dev + 'styles/scss/renderers',
    cssFolder   = dev + 'styles/css';
/*=====  End of References  ======*/


/*======================================
=            Register tasks            =
======================================*/
gulp.task('default', function () {
    console.log('======================================');
    console.log('                                      ');
    console.log('       Use "$ gulp watch|build"       ');
    console.log('                                      ');
    console.log('======================================');
});

gulp.task('watch', function () {
    browserSync.init({ server: dev });

    gulp.watch(gulpFile,  ['notification']);
    gulp.watch(scssFiles, ['compass']);
    gulp.watch(jsFiles,   ['qualitiy']);

    gulp.watch(htmlFiles).on('change', browserSync.reload);
    gulp.watch(jsFiles).on('change', browserSync.reload);
});

gulp.task('build', function () {
    runSequence('clean', 'copy', 'usemin', 'minify');
});
/*=====  End of Register tasks  ======*/


/*====================================
=            Config tasks            =
====================================*/
gulp.task('notification', function () {
    console.log('======================================');
    console.log('                                      ');
    console.log('   Use "Ctrl + C" and "$ gulp watch"  ');
    console.log('                                      ');
    console.log('======================================');

    return gulp.src(gulpFile)
        .pipe(jshint({ node: true }))
        .pipe(jshint.reporter('default'))
        .pipe(jslint({
            devel: true,
            node: true
        }))
        .on('error', function (error) {
            console.error(String(error));
        });
});

gulp.task('compass', function () {
    return gulp.src(renderersFiles)
        .pipe(compass({
            config_file: './config.rb',
            css: cssFolder,
            sass: scssFolder
        }))
        .on('error', function (error) {
            console.log(error);
            this.emit('end');
        })
        .pipe(gulp.dest(cssFolder))
        .pipe(browserSync.stream());
});

gulp.task('qualitiy', function () {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jslint({
            browser: true,
            devel: true,
            global: ['$'],
            node: true
        }))
        .on('error', function (error) {
            console.error(String(error));
        });
});

gulp.task('clean', function () {
    return gulp.src(dist)
        .pipe(clean(dist));
});

gulp.task('copy', function () {
    gulp.src(dev + 'assets/fonts/**/*')
        .pipe(gulp.dest(dist + 'assets/fonts'));

    gulp.src(dev + 'assets/imgs/**/*')
        .pipe(gulp.dest(dist + 'assets/imgs'));
});

gulp.task('usemin', function () {
    return gulp.src(htmlFiles)
        .pipe(usemin())
        .pipe(gulp.dest(dist));
});

gulp.task('minify', function () {
    gulp.src(dist + '**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(dist));

    gulp.src(dev + 'styles/css/**/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest(dist + 'style'));

    gulp.src(dist + 'scripts/main.js')
        .pipe(uglify())
        .pipe(gulp.dest(dist + 'js'));
});
/*=====  End of Config tasks  ======*/