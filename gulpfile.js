var gulp         = require('gulp'),
	sourcemaps   = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	cssmin       = require('gulp-cssmin'),
	jsmin        = require('gulp-jsmin'),
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
        .pipe(jsmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(''))
});

// Watcher for GalleriomJS app
gulp.task('watch', function() {
    gulp.watch('galleriom.css', ['css']);
    gulp.watch('galleriom.js', ['js']);
});