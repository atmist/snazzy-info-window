"use strict";

var gulp = require('gulp');
var run = require('gulp-run');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var concat = require('gulp-concat');

var paths = {
    sass: './scss/**/*.scss',
    src_sass: '../src/scss/**/*.scss'
};


//Install all the bower components for the test
gulp.task('bower:install', function(){
    return run('npm run bower -- install').exec();
});

//Build the css from the scss files
gulp.task('sass:build', function(){
    return gulp.src('./scss/index.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./'));
});

//Rebuild the sass files when they change
gulp.task('sass:watch', function(){
    gulp.watch(paths.sass, ['sass:build']);
    gulp.watch(paths.src_sass, ['sass:build']);
});

//Build all the test dependencies
gulp.task('build', ['bower:install', 'sass:build']);

//Clean all the files except for node_modules
gulp.task('clean', function(){
    return del([
        './index.css',
        './bower_components'
    ]);
});
