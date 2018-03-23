// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');

// eslint configuration
var eslint = require('gulp-eslint');
require('gulp-lint-tasks');

gulp.task('sass', function() {
    gulp.src('assets/css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(function(f) {
            return f.base;
        }))
});

gulp.task('default', ['sass'], function() {
    gulp.watch('assets/css/*.scss', ['sass']);
})