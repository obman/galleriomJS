var gulp         = require('gulp'),
	sourcemaps   = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	cssmin       = require('gulp-cssmin'),
	uglify       = require('gulp-uglify'),
	rename       = require('gulp-rename');


// GalleriomJS app
gulp.task('css', function() {
	return gulp.src('galleriom.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(''))
});

gulp.task('js', function() {
    return gulp.src('galleriom.js')
        .pipe(uglify({ preserveComments: 'license' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(''))
});

gulp.task('copy-css', function() {
    return gulp.src('galleriom.min.css')
        .pipe(gulp.dest('../gh-pages/'));
});

gulp.task('copy-js', function() {
    return gulp.src('galleriom.min.js')
        .pipe(gulp.dest('../gh-pages/'));
});

// Watcher for GalleriomJS app
gulp.task('watch', function() {
    gulp.watch('galleriom.css', ['css', 'copy-css']);
    gulp.watch('galleriom.js', ['js', 'copy-js']);
});