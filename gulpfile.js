/*-------------------------------------------------------------------
  Required plugins
-------------------------------------------------------------------*/

var gulp = require('gulp'),
    // path to package.json
    pkg = require('./package.json'),
    // reload browser
    browserSync = require('browser-sync'),
    // load gulp plugins
    plugins = require('gulp-load-plugins')();

/*-------------------------------------------------------------------
  Configuration
-------------------------------------------------------------------*/

var consoleErorr = function(err) {
  plugins.util.beep();
  console.log(err.message);
};

/*------DEV TASKS------*/

// scripts
gulp.task('js', function() {
  gulp.src('js/app.js')
    .pipe(plugins.plumber({
      errorHandler: consoleErorr
      }))
    .pipe(plugins.concat('app.min.js'))
    .pipe(plugins.uglify({
      mangle: true
    }))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.reload({
      stream:true
    }));
});

// Stylus
gulp.task('css', function() {
    gulp.src('css/main.css')
    .pipe(plugins.plumber({
      errorHandler: consoleErorr
      }))
    .pipe(plugins.concat('main.min.css'))
    .pipe(plugins.autoprefixer(
      'Android >= ' + pkg.browsers.android,
      'Chrome >= ' + pkg.browsers.chrome,
      'Firefox >= ' + pkg.browsers.firefox,
      'Explorer >= ' + pkg.browsers.ie,
      'iOS >= ' + pkg.browsers.ios,
      'Opera >= ' + pkg.browsers.opera,
      'Safari >= ' + pkg.browsers.safari
      ))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream:true
    }));
});

// Static server
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});


// Watcher
gulp.task('default', ['browser-sync'], function() {

  // watch css
  gulp.watch('css/main.css', ['css']);

  // watch coffee
  gulp.watch('js/app.js', ['js']);

  gulp.watch("*.html").on("change", browserSync.reload);

});