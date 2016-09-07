var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var del = require('del');
var gae = require('gulp-gae');

var gae_dir = '/Users/eyuelt/Downloads/google_appengine';
gulp.task('gae-serve', function() {
  gulp.src('app.yaml').
    pipe(gae('dev_appserver.py', [], {
      port: 8081,
      admin_port: 8001,
    }, gae_dir));
});


// Clean
gulp.task('clean:index', function() {
  del(['dist/index.html']);
});

gulp.task('clean:css', function() {
  del(['dist/css/*']);
});

gulp.task('clean', ['clean:index', 'clean:css']);


// Build
gulp.task('build:index', ['clean:index'], function() {
  return gulp.src('src/index.html').
    pipe(gulp.dest('dist/')).
    pipe(browserSync.stream());
});

gulp.task('build:css', ['clean:css'], function() {
  return gulp.src('src/css/*').
    pipe(concat('main.css')).
    pipe(gulp.dest('dist/css')).
    pipe(browserSync.stream());
});

gulp.task('build', ['build:index', 'build:css']);


// Serve
gulp.task('watch', function() {
  gulp.watch('src/index.html', ['build:index']);
  gulp.watch('src/css/*', ['build:css']);
});

gulp.task('serve', ['build', 'watch'], function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('default', ['serve']);
