// grab our packages
var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
	
    jasmine = require('gulp-jasmine');
	

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the jshint task
gulp.task('jshint', function() {
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
gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['jshint', 'test']);
});

