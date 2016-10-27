/* eslint-disable no-console */
const gulp = require('gulp-help')(require('gulp'), { hideDepsMessage: true });
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
const bump = require('gulp-bump');
const args = require('yargs').argv;
const git = require('gulp-git');
const tag = require('gulp-tag-version');
const filter = require('gulp-filter');
const addsrc = require('gulp-add-src');

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

gulp.task('build:dist', 'Builds the JavaScript and SASS for a release to the dist directory.', ['build:dist:sass', 'build:dist:js']);
gulp.task('build:dist:sass', 'Builds the SASS for a release to the dist directory.', ['lint:sass'], transpileSASS('./dist', true));
gulp.task('build:dist:js', 'Builds the JavaScript for a release to the dist directory.', ['lint:js'], transpileJS('./dist', true));

gulp.task('build:test', 'Builds the JavaScript and SASS for the test directory.', ['build:test:sass', 'build:test:js']);
gulp.task('build:test:sass', 'Builds the SASS for the test directory.', ['lint:sass'], transpileSASS('./test/css', false));
gulp.task('build:test:js', 'Builds the JavaScript for the test directory.', ['lint:js'], transpileJS('./test/scripts', false));

gulp.task('watch', 'Watch the project for file changes and trigger linting and building.', () => {
    gulp.watch('./src/scss/**/*.scss', ['build:test:sass']);
    gulp.watch('./src/snazzy-info-window.js', ['build:test:js']);
    gulp.watch('./gulpfile.js', ['lint:js']);
});

gulp.task('lint', 'Lint the JavaScript and SASS files.', ['lint:js', 'lint:sass']);
gulp.task('lint:js', 'Lint the JavaScript files.', () => {
    return gulp.src(['./src/snazzy-info-window.js', './gulpfile.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .on('error', function onError() {
            this.emit('end');
        });
});

gulp.task('lint:sass', 'Lint the SASS files.', () => {
    return gulp.src(['./src/scss/**/*.scss'])
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

gulp.task('release', 'Increment the version number, then build, commit, and tag the release.', ['build:dist'], () => {
    const version = args.version;
    const type = args.type;
    const options = {};
    if (version) {
        options.version = version;
    } else {
        options.type = type;
    }

    return gulp.src(['./package.json', './bower.json'])
        .pipe(bump(options))
        .pipe(gulp.dest('.'))
        .pipe(addsrc('./dist/**/*'))
        .pipe(git.commit('Released a new version.'))
        .pipe(filter('package.json'))
        .pipe(tag({ prefix: '' }));
}, {
    options: {
        'type=patch': 'Eg. bump from 0.1.0 -> 0.1.1',
        'type=minor': 'Eg. bump from 0.1.1 -> 0.2.0',
        'type=major': 'Eg. bump from 0.2.1 -> 1.0.0',
        'version=x.x.x': 'Bump to the given version number'
    }
});
