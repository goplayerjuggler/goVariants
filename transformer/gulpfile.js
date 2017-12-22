"use strict"
// grab our packages
var gulp = require('gulp'),
  jshint = require('gulp-jshint'),

  jasmine = require('gulp-jasmine');


// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the jshint task
gulp.task('jshint', function () {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
// configure the jasmine/unit test task
gulp.task('test', () =>
  gulp.src('spec/*Spec.js')
    // gulp-jasmine works on filepaths so you can't have any plugins before it 
    .pipe(jasmine())
);

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['jshint', 'test']);
});

// var browserify = require('browserify');
// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');
// var gutil = require('gulp-util');

// gulp.task('bundle', function () {
//   // set up the browserify instance on a task basis
//   var b = browserify({
//     entries: 'src/transform.js',
//     debug: true
//   });

//   return b.bundle()
//     // .pipe(source('app.js'))
//     .pipe(buffer())
//     .pipe(sourcemaps.init({loadMaps: true}))
//         // Add transformation tasks to the pipeline here.
//         .pipe(uglify())
//         .on('error', gutil.log)
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest('./dist/'));
// });
//---
var browserify = require('browserify');
// var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
// var babelify = require("babelify");
var babel = require('gulp-babel');


gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  // var b = browserify({
  //   entries: 'src/transform.js',
  //   debug: true
  // });
  var b = browserify('src/transform.js', { standalone: 'goVariantsTransform' });
  return b
    // .transform('babelify', {
    //   // presets: ["env"], 
    //   "presets": ["es2015"],
    // "plugins":["transform-object-rest-spread"]})
    // .transform('gulp-babel')
    .bundle()
    .pipe(source('transform.min.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    .pipe(babel())

    .pipe(uglify())
    .on('error', gutil.log)
    // .pipe(sourcemaps.write('./dist/js/'))
    .pipe(gulp.dest('./dist'));
    // .pipe(babel())

    // .pipe(uglify())
    // .pipe(gulp.dest('./dist'));
});

// var babel = require('gulp-babel');
// gulp.task('es6', () => {
//   gulp.src('./dist/js/app.js')
//     .pipe(babel())

//     .pipe(uglify())
//     .pipe(gulp.dest('./dist/dist_es5/app.js'));
// });