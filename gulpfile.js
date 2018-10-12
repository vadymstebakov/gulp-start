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
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const cache = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const debug = require('gulp-debug');

// SCSS to CSS
gulp.task('scss', function() {
	return gulp.src('app/scss/**/*.scss')
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
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// JS libs to min
gulp.task('scripts', function() {
	return gulp.src('app/libs/...') /*настрой под свои скрипты*/
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'JS Concate',
					message: err.message
				};
			})
		}))
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

// CSS libs to min
gulp.task('css-libs', ['scss'], function() {
	return gulp.src('app/css/libs.css')
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'CSS Concate',
					message: err.message
				};
			})
		}))
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/css'));
});

// Browser Sync
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        ghostMode: false
    });
});

// Clear directory
gulp.task('clean', function() {
    return del.sync('dist');
});

// Clear cache
gulp.task('clear', function() {
    return cache.clearAll();
});

// Img min
gulp.task('img', function () {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 7,
			svgoPlugins: [{
				removeViewBox: false
			}],
			plugins: [
				imageminJpegRecompress({
					quality: 'veryhigh'
				})
			],
			use: [
				imageminPngquant({
					verbose: true
				})
			]
		})))
        .pipe(gulp.dest('dist/img'));
});

// Watcher
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/scss/**/*.scss', ['scss']);
    gulp.watch('app/*html', browserSync.reload);
    gulp.watch('app/js/*js', browserSync.reload);
});

// Builder
gulp.task('build', ['clean', 'img', 'scss', 'scripts'], function() {
    var buildCss = gulp.src([
            'app/css/style.css',
            'app/css/libs.min.css'
        ])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist/'));
});