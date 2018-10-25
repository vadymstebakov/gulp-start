'use strict';

const gulp = require('gulp');
const wait = require('gulp-wait');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const debug = require('gulp-debug');

// Path
const path = {
    dist: { 
		html: 'dist/',
		css: 'dist/css/',
        js: 'dist/js/',
		img: 'dist/img/',
		fonts: 'dist/fonts/'
    },
    app: {
		html: 'app/*.html',
		scss: 'app/scss/**/*.scss',
		cssLibs: 'app/libs-css/**/*.css',
		js: 'app/js/**/*.js',
		jsLibs: 'app/libs-js/**/*.js',
		img: 'app/img/**/*',
		fonts: 'app/fonts/**/*'
    },
    watch: {
		html: 'app/**/*.html',
		scss: 'app/scss/**/*.scss',
        js: 'app/js/**/*.js',
		img: 'app/img/**/*',
		fonts: 'app/fonts/**/*'
    }
};

// HTML
gulp.task('html', function () {
	return gulp.src(path.app.html)
        .pipe(gulp.dest(path.dist.html))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// SCSS to CSS
gulp.task('scss', function() {
	return gulp.src(path.app.scss)
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Style',
                    message: err.message
                };
            })
		}))
		.pipe(wait(500))
        .pipe(sass())
        .pipe(autoprefixer([
            'last 15 versions',
            '> 1%', 'ie 8', 'ie 7'
        ], {
            cascade: true
		}))
		// .pipe(cssnano())
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        .pipe(gulp.dest(path.dist.css))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// CSSlibs to dist
gulp.task('csslibs', function() {
	return gulp.src(path.app.cssLibs)
		.pipe(concat('libs.css'))
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.dist.css));
});

// JS
gulp.task('js', function () {
	return gulp.src(path.app.js)
		// .pipe(concat('libs.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(path.dist.js))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// JSlibs to dist
gulp.task('jslibs', function() {
	return gulp.src(path.app.jsLibs)
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js));
});

// Clear dir
gulp.task('clean', function() {
    return del.sync('dist');
});

// Clear dir img
gulp.task('clear', function() {
    return del.sync(path.dist.img);
});

// Img
gulp.task('img', function () {
	return gulp.src(path.app.img)
        .pipe(gulp.dest(path.dist.img))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Fonts
gulp.task('fonts', function() {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

// Builder
gulp.task('build', [
	'clean',
	'html',
	'scss',
	'csslibs',
	'js',
	'jslibs',
	'img',
	'fonts'
]);

// Browser-Sync
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        notify: false,
        ghostMode: false
    });
});

// Watcher
gulp.task('watch', function(){
    gulp.watch([path.watch.html], ['html']);
    gulp.watch([path.watch.scss], ['scss']);
    gulp.watch([path.watch.js], ['js']);
	gulp.watch([path.watch.img], ['clear']);
	gulp.watch([path.watch.img], ['img']);
});

// Start
gulp.task('default', ['build', 'browser-sync', 'watch']);