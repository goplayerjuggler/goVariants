"use strict"
// grab our packages
const gulp = require('gulp'),
  eslint = require('gulp-eslint'),

  jasmine = require('gulp-jasmine'),

  gulpsync = require('gulp-sync')(gulp)


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

// let browserify = require('browserify');
// let source = require('vinyl-source-stream');
// let buffer = require('vinyl-buffer');
// let uglify = require('gulp-uglify');
// let sourcemaps = require('gulp-sourcemaps');
// let gutil = require('gulp-util');

// gulp.task('bundle', function () {
//   // set up the browserify instance on a task basis
//   let b = browserify({
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
let browserify = require('browserify');
// let gulp = require('gulp');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let uglify = require('gulp-uglify');
let sourcemaps = require('gulp-sourcemaps');
let gutil = require('gulp-util');
let babelify = require("babelify");
let babel = require('gulp-babel')


function bundler(fileName, standalone) {
  return () => {
    let options = { debug: true }
    if (standalone) {
      options.standalone = `go_variants_${standalone}`
    }
    let b = browserify(`${fileName}.js`, options).transform(babelify);
    return b
      .bundle()
      .pipe(source(`${fileName}.min.js`))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(gutil.env.env === 'prod' ? babel() : gutil.noop())
      .pipe(gutil.env.env === 'prod' ? uglify() : gutil.noop())
      .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'));
  }
}

gulp.task('bundle1', bundler('src/transform', 'transform'));
gulp.task('bundle2', bundler('src/transformer', 'transformer'));
gulp.task('bundle3', bundler('ui/editor', 'editor'));

gulp.task('bundles', gulpsync.sync(['bundle1', 'bundle2', 'bundle3']))

gulp.task('set-dev-node-env', function () {
  return process.env.NODE_ENV = 'development'
})

gulp.task('set-prod-node-env', function () {
  return process.env.NODE_ENV = 'production'
})