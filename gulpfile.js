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
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const argv = require('yargs').argv;
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
	src: {
		html: 'src/*.html',
		scss: 'src/scss/**/*.scss',
		cssLibs: 'src/libs-css/**/*.css',
		js: 'src/js/**/*.js',
		jsLibs: 'src/libs-js/**/*.js',
		img: 'src/img/**/*',
		fonts: 'src/fonts/**/*'
	},
	watch: {
		html: 'src/**/*.html',
		scss: 'src/scss/**/*.scss',
		js: 'src/js/**/*.js',
		img: 'src/img/**/*',
		fonts: 'src/fonts/**/*'
	}
};

// HTML
gulp.task('html', function () {
	return gulp.src(path.src.html)
		.pipe(gulp.dest(path.dist.html))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// SCSS to CSS
gulp.task('scss', function() {
	return gulp.src(path.src.scss)
		.pipe(wait(500))
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'scss',
					message: err.message
				};
			})
		}))
		.pipe(gulpIf(argv.dev, sourcemaps.init()))
		.pipe(debug({title: 'DEBUG scss'}))
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(autoprefixer({
			browsers: ['> 0.1%'],
			cascade: false
		}))
		// .pipe(cssnano())
		// .pipe(rename({
		//     suffix: '.min'
		// }))
		.pipe(gulpIf(argv.dev, sourcemaps.write()))
		.pipe(gulp.dest(path.dist.css))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// CSSlibs to dist
gulp.task('css-libs', function() {
	return gulp.src(path.src.cssLibs)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'css-libs',
					message: err.message
				};
			})
		}))
		.pipe(debug({title: 'DEBUG css-libs'}))
		.pipe(concat('libs.css'))
		.pipe(cssnano())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(path.dist.css));
});

// JS
gulp.task('js', function () {
	return gulp.src(path.src.js)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'js',
					message: err.message
				};
			})
		}))
		.pipe(gulpIf(argv.dev, sourcemaps.init()))
		.pipe(debug({title: 'DEBUG js'}))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		// .pipe(concat('libs.min.js'))
		// .pipe(uglify())
		.pipe(gulpIf(argv.dev, sourcemaps.write()))
		.pipe(gulp.dest(path.dist.js))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// JSlibs to dist
gulp.task('js-libs', function() {
	return gulp.src(path.src.jsLibs)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'js-libs',
					message: err.message
				};
			})
		}))
		.pipe(debug({title: 'DEBUG js-libs'}))
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(path.dist.js));
});

// Clear dir
gulp.task('clean', function() {
	return del.sync('dist');
});

// Img
gulp.task('img', function () {
	return gulp.src(path.src.img)
		.pipe(gulp.dest(path.dist.img))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Fonts
gulp.task('fonts', function() {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.dist.fonts));
});

// Builder
gulp.task('build', [
	'clean',
	'html',
	'scss',
	'css-libs',
	'js',
	'js-libs',
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
	gulp.watch([path.watch.img], ['img']);
});

// Start
gulp.task('default', ['build', 'browser-sync', 'watch']);

// gulp --dev (с sourcemaps)
// gulp (без sourcemaps)