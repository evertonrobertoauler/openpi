var path = require('path');
var gulp = require('gulp');
var gulpReplace = require('gulp-replace');
var gulpSass = require('gulp-sass');
var webpackConfig = require('./webpack.config');

gulp.task('fix-typings', function() {
  gulp
    .src('typings/**/*.d.ts')
    .pipe(gulpReplace('export =', 'export default'))
    .pipe(gulp.dest('typings'));
});

gulp.task('fix-webpack', function() {
  var dest = path.join(__dirname, 'node_modules', 'webpack', 'node_modules', 'watchpack', 'lib');

  gulp
    .src(path.join(dest, 'DirectoryWatcher.js'))
    .pipe(gulpReplace('usePolling: options.poll ? true : undefined', 'usePolling: true'))
    .pipe(gulpReplace('interval: typeof options.poll === "number" ? options.poll : undefined', 'interval: 500'))
    .pipe(gulp.dest(dest));
});

gulp.task('sass', function () {
  return gulp
    .src(path.join(webpackConfig.context, 'index.scss'))
    .pipe(gulpSass())
    .pipe(gulp.dest(webpackConfig.context));
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(path.join(webpackConfig.context, '**', '**', '**', '*.scss'), ['sass']);
});
