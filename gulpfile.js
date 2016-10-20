"use strict";

var gulp = require('gulp');
var run = require('gulp-run');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var concat = require('gulp-concat');

var paths = {
    src_sass: './src/scss/**/*.scss',
    test_sass: './test/scss/**/*.scss'
};

//Install all the bower components for the test
gulp.task('bower:install', function(){
    return run('npm run bower -- install').exec();
});

//Build all the test dependencies
gulp.task('build:src', ['bower:install', 'build:src:sass']);
gulp.task('build:test', ['bower:install', 'build:test:sass']);

//SASS
var sassTaskBuilder = function(mainFile, dest){
	return function(cb){
	    setTimeout(function(){
	        gulp.src(mainFile)
	            .pipe(sass().on('error', sass.logError))
	            .pipe(autoprefixer())
	            .pipe(gulp.dest(dest));
	        cb();
	    }, 100);
	};
};
gulp.task('build:src:sass', sassTaskBuilder('./src/scss/snazzy-info-window.scss', './dist'));
gulp.task('build:test:sass', sassTaskBuilder('./test/scss/index.scss', './test'));

//Rebuild the sass files when they change
gulp.task('watch', function(){
    gulp.watch(paths.test_sass, ['build:src:sass', 'build:test:sass']);
    gulp.watch(paths.src_sass, ['build:src:sass', 'build:test:sass']);
});

//Clean all the files except for node_modules
gulp.task('clean', function(){
    return del([
        './test/index.css',
		'./dist',
        './bower_components'
    ]);
});
