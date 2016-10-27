/* eslint-disable no-console */
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const sassLint = require('gulp-sass-lint');

const transpileSASS = (destFolder, includeUnminified) => {
    return (cb) => {
        setTimeout(() => {
            gulp.src('./src/scss/snazzy-info-window.scss')
                .pipe(sourcemaps.init())
                .pipe(sass().on('error', sass.logError))
                .pipe(autoprefixer())
                .pipe(gulpif(includeUnminified, gulp.dest(destFolder)))
                .pipe(rename({ extname: '.min.css' }))
                .pipe(uglifycss())
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(destFolder));
            cb();
        }, 100);
    };
};

const transpileJS = (destFolder, includeUnminified) => {
    return () => {
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
            .on('error', function onError() {
                this.emit('end');
            })
            .pipe(gulpif(includeUnminified, gulp.dest(destFolder)))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(destFolder));
    };
};

gulp.task('build:dist', ['build:dist:sass', 'build:dist:js']);
gulp.task('build:dist:sass', ['lint:sass'], transpileSASS('./dist', true));
gulp.task('build:dist:js', ['lint:js'], transpileJS('./dist', true));

gulp.task('build:test', ['build:test:sass', 'build:test:js']);
gulp.task('build:test:sass', ['lint:sass'], transpileSASS('./test/css', false));
gulp.task('build:test:js', ['lint:js'], transpileJS('./test/scripts', false));

gulp.task('watch', () => {
    gulp.watch('./src/scss/**/*.scss', ['build:test:sass']);
    gulp.watch('./src/snazzy-info-window.js', ['build:test:js']);
    gulp.watch('./gulpfile.js', ['lint:js']);
});

gulp.task('lint', ['lint:js', 'lint:sass']);
gulp.task('lint:js', () => {
    return gulp.src(['./src/snazzy-info-window.js', './gulpfile.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .on('error', function onError() {
            this.emit('end');
        });
});

gulp.task('lint:sass', () => {
    return gulp.src(['./src/scss/**/*.scss'])
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});
