/* eslint-disable no-console */
const gulp = require('gulp');
const run = require('gulp-run');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const paths = {
    src_sass: './src/scss/**/*.scss',
    test_sass: './test/scss/**/*.scss'
};

// Install all the bower components for the test
gulp.task('bower:install', () => {
    return run('npm run bower -- install').exec();
});

// Build all the test dependencies
gulp.task('build:src', ['bower:install', 'build:src:sass']);
gulp.task('build:test', ['bower:install', 'build:test:sass']);

// SASS
const sassTaskBuilder = (mainFile, dest) => {
    return (cb) => {
        setTimeout(() => {
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

// JS
gulp.task('build:src:js', () => {
    return gulp.src('./src/snazzy-info-window.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015'],
            plugins: [
                'add-module-exports',
                'transform-es2015-modules-umd'
            ],
            moduleId: 'SnazzyInfoWindow'
        }))
        .on('error', (e) => {
            console.log('>>> ERROR', e.message);
            this.emit('end');
        })
        .pipe(gulp.dest('dist'))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

// Code analysis using eslint
gulp.task('lint', () => {
    return gulp.src(['./src/snazzy-info-window.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .on('error', () => this.emit('end'));
});

// Rebuild the sass files when they change
gulp.task('watch', () => {
    gulp.watch(paths.test_sass, ['build:src:sass', 'build:test:sass']);
    gulp.watch(paths.src_sass, ['build:src:sass', 'build:test:sass']);
    gulp.watch('./src/snazzy-info-window.js', ['lint', 'build:src:js']);
});

// Clean all the files except for node_modules
gulp.task('clean', () => {
    return del([
        './test/index.css',
        './dist',
        './bower_components'
    ]);
});
