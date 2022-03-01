/*

=========================================================
* AppSeed - Simple SCSS compiler via Gulp
=========================================================

*/

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cleanCss = require('gulp-clean-css');
var gulp = require('gulp');
const npmDist = require('gulp-npm-dist');
var sass = require('gulp-sass')(require('node-sass'));
var wait = require('gulp-wait');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");
const webp = require('gulp-webp');

var imageminWebp = require('imagemin-webp');

// Define COMMON paths

const paths = {
    src: {
        base: './',
        css: '../css',
        scss: './scss',
        node_modules: './node_modules/',
        vendor: '../vendor',
        images: '../images',
    }
};

// Copy dist js
gulp.task('copy:libs', function() {
    return gulp.src(npmDist(), {base:paths.src.node_modules})
        .pipe(rename(function(path) {
            path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
        }))
        .pipe(gulp.dest(paths.src.vendor));
});

// Compile SCSS
gulp.task('scss', function() {
    return gulp.src([
        paths.src.scss + '/style.scss',
    ])
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 1%']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.src.css))
        .pipe(browserSync.stream());
});

// Minify CSS
gulp.task('minify:css', function() {
    return gulp.src([
            paths.src.css + '/style.css'
        ])
        .pipe(cleanCss())
        .pipe(rename(function(path) {
            // Updates the object in-place
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest(paths.src.css))
});

// Convert pictures
gulp.task('convert:webp', function() {
    return gulp.src([paths.src.base + 'images/**', paths.src.base + 'images/*'])
        .pipe(webp())
        .pipe(gulp.dest(paths.src.images))
        .pipe(rename(function(path) {
            path.dirname = path.dirname.replace(' ', '-');
        }))
        .pipe(gulp.dest(paths.src.images))
})

// Default Task: Compile SCSS and minify the result
gulp.task('default', gulp.series('scss', 'minify:css'));