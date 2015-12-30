var gulp         = require('gulp'),
	sourcemaps   = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	concat       = require('gulp-concat'),
	cssmin       = require('gulp-cssmin'),
	jsmin        = require('gulp-jsmin'),
	rename       = require('gulp-rename'),
    zip          = require('gulp-zip');


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
    return gulp.src('js/development/*.js')
        .pipe(concat('script.js'))
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


// Watcher for GalleriomJS app
gulp.task('watch', function() {
    gulp.watch('galleriom.css', ['css']);
    gulp.watch('galleriom.js', ['js']);
});

// Watcher for GalleriomJS web page
gulp.task('stream', function() {
    gulp.watch('css/development/*.css', ['styles', 'zipit', 'zipit-min']);
    gulp.watch('js/development/*.js', ['scripts', 'zipit', 'zipit-min']);
});