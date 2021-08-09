/*
 * Gulp file
 * Paul Collett paulcollett.com
*/

// Gulp & Gulp Plugins
var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var jsinclude    = require("gulp-include");
var iconfont     = require('gulp-iconfont');
var del          = require('del');
var notify       = require('gulp-notify');
var browserSync  = require('browser-sync');

// Original Asset Paths
var src = {
  css: 'src/**/*.sass',
  js: ['src/**/*.js','!src/**/_*.js'],
  icons: ['src/fonts/icons/**/*'],
  images: ['src/**/*.{png,svg,jpg,ico}'],
  fonts: ['src/fonts/**/*','!src/fonts/icons/**/*']
};

// Destination Asset Paths
var dest = {
  css: 'dist',
  js: 'dist',
  icons: 'dist/fonts',
  images: 'dist',
  fonts: 'dist/fonts'
};


// Main Tasks

gulp.task('default',['clean'],function(){
  gulp.start('build');
});

gulp.task('watch',['default'],function(){
  gulp.watch(src.css, {cwd:'./'}, ['compile-sass-to-css-min']);
  gulp.watch(src.js, {cwd:'./'}, ['compile-js-to-min']);
  gulp.watch(src.icons, {cwd:'./'}, ['compile-svgs-to-font']);
  gulp.watch(src.images, {cwd:'./'}, ['move-images']);
});

gulp.task('serve',['watch'],function(){
  notifications = true;

  browserSync({
    port: "3030",
    notify: false,
    async: true,
    server: {
      baseDir: '../'
    },
    open: 'local'
  });
});

// Specific Tasks

gulp.task('clean',function(){
  //for(i in dest) del(dest[i]);
});

gulp.task('build',[
  'compile-sass-to-css-min',
  'move-images',
  'move-fonts',
  'compile-js-to-min'
]);

gulp.task('compile-sass-to-css-min', function(){
  return gulp.src( src.css )
    .pipe(plumber({
        errorHandler: css_error_os_alert
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      precision: 4,
    }))
    .pipe(autoprefixer({
      browsers: ['ie >= 8', '> 1%']
    }))
    .pipe(sourcemaps.write( './'))
    .pipe(gulp.dest( dest.css ))
    .pipe(browserSync.stream({match: '**/*.{css}'}))
    .pipe(notify({
        title:"CSS Updated",
        onLast:true
    }));
});

gulp.task('move-images', function() {
  return gulp.src( src.images )
    .pipe(gulp.dest( dest.images ))
    .pipe(browserSync.stream());
});

gulp.task('move-fonts', function() {
  return gulp.src( src.fonts )
    .pipe(gulp.dest( dest.fonts ))
    .pipe(browserSync.stream());
});

gulp.task("js-error-check", function() {
  return gulp.src( src.js )
    .pipe(plumber({errorHandler: js_error_os_alert}))
    .pipe(uglify({mangle: false}));
});

gulp.task("compile-js-to-min",['js-error-check'], function() {
  return gulp.src( src.js )
    .pipe(sourcemaps.init())
    .pipe(jsinclude())
    .pipe(uglify({mangle: false}))
    .on('error',function(){})
    .pipe(sourcemaps.write( './'))
    .pipe(gulp.dest( dest.js ))
    .pipe(browserSync.stream({match: '**/*.{js,map}'}));
});

// Notifications (enabled when using "proxy" task)
var notifications = false;

var css_error_os_alert = function(error){
  notifications && notify.onError({
    title: 'SASS error',
    subtitle: error.formatted.split("\n")[0],
    message: error.message.split("\n")[0] + ' on line: ' + error.line,
    sound: "Funk",
  })(error); //Error Notification
  this.emit("end"); //End function
};

var js_error_os_alert = function(error){
  notifications && notify.onError({
    title: 'JS error',
    subtitle: error.message.split(" ").slice(1).join(" "),
    message: error.message.split(" ")[0].split("/").pop() + ' on line: ' + error.lineNumber,
    sound: "Funk",
  })(error); //Error Notification
  this.emit("end"); //End function
}
