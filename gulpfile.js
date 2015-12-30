var gulp         = require('gulp'),
	sourcemaps   = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	concat       = require('gulp-concat'),
	cssmin       = require('gulp-cssmin'),
	uglify       = require('gulp-uglify'),
    zip          = require('gulp-zip');

// GalleriomJS web page
gulp.task('styles', function() {
    return gulp.src('css/development/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(concat('style.min.css'))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css/built/'))
});

gulp.task('scripts', function() {
    return gulp.src(['js/development/velocity.min.js', 'js/development/main.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('script.min.js'))
        .pipe(uglify({ preserveComments: 'license' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('js/built'))
});

gulp.task('zipit', function () {
    return gulp.src(['galleriom.css', 'galleriom.js', 'galleriom@2x.png', 'package.json', 'gulpfile.js', 'README.md'])
        .pipe(zip('galleriom.zip'))
        .pipe(gulp.dest(''));
});

gulp.task('zipit-min', function () {
    return gulp.src(['galleriom.min.css', 'galleriom.min.js', 'galleriom@2x.png', 'package.json', 'gulpfile.js', 'README.md'])
        .pipe(zip('galleriom-min.zip'))
        .pipe(gulp.dest(''));
});

// Watcher for GalleriomJS web page
gulp.task('stream', function() {
    gulp.watch('css/development/*.css', ['styles', 'zipit', 'zipit-min']);
    gulp.watch('js/development/*.js', ['scripts', 'zipit', 'zipit-min']);
});