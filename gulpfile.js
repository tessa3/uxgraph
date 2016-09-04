var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');

// Build
gulp.task('build:index', function() {
  return gulp.src('src/index.html').
    pipe(gulp.dest('dist/')).
    pipe(browserSync.stream());
});

gulp.task('build:css', function() {
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

gulp.task('serve', ['watch'], function() {
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
