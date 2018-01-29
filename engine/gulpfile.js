"use strict"
// grab our packages
const gulp = require('gulp'),
  eslint = require('gulp-eslint'),

  jasmine = require('gulp-jasmine')


// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the eslint task
gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', 'samples/**/*.js', 'ui/**/*.js', 'utils/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
});
// configure the jasmine/unit test task
gulp.task('test', () =>
  gulp.src('spec/*Spec.js')
    // gulp-jasmine works on filepaths so you can't have any plugins before it 
    .pipe(jasmine())
);

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['lint', 'test']);
});