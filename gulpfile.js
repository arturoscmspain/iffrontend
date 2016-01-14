// CONFIG  ========================================
var config  = {
    inmofactoryLocalPath : 'C:/gitscmspain/realestate-inmofactory/realestate-inmofactory/InmofactoryMVC4/'
};

// VARIABLES ========================================

var _contentRoot     = config.inmofactoryLocalPath + 'Content';
var _views           = config.inmofactoryLocalPath + 'Views';

var path = {
    src         : 'src',
    dist        : 'dist',
    tmp         : '.tmp',
    contentRoot : _contentRoot,
    views : _views,
};


var gulp        = require('gulp'),
    minifyCss   = require('gulp-minify-css'),
    sourcemaps  = require('gulp-sourcemaps'),
    postcss     = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    pxtorem     = require('postcss-pxtorem'),
    browsersync = require('browser-sync'),
    colors      = require('colors'),
    beep        = require('beepbeep'),
    del         = require('del'),
    cp          = require('child_process'),
    runSequence = require('run-sequence'),
    sass        = require('gulp-sass'),
    plumber     = require('gulp-plumber'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    notify      = require('gulp-notify'),
    uglify      = require('gulp-uglify');


// ERROR HANDLER ========================================
var onError = function(err) {
    beep([200, 200]);
    console.log(
        '\n*****************' + ' \\(°□°)/ '.bold.red + '<( ERROR! ) '.bold.blue + '*****************\n\n' +
        String(err) +
        '\n*******************************************************\n' );
    this.emit('end');
};


// CSS's de Inmofactory ===============================================
gulp.task('cssContent', function() {
    gulp.src( path.contentRoot + '/css/**/*.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(postcss([ pxtorem({ replace: false,
                                  root_value: 10,
                                  prop_white_list: ['font', 'font-size']
         }) ]))
        .pipe(gulp.dest( path.contentRoot + '/css' ));
});


gulp.task('cssViews', function() {
    gulp.src(path.views + '/**/*.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(postcss([ pxtorem({ replace: false,
                                  root_value: 10,
                                  prop_white_list: ['font', 'font-size']
         }) ]))
         .pipe(gulp.dest( path.views));
});


function createOrChangeCssFile(file){
    gulp.src(file.path)
         .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(postcss([ pxtorem({ replace: false,
                                  root_value: 10,
                                  prop_white_list: ['font', 'font-size']
         }) ]))
        //Deja el fichero alojado en el mismo directorio donde estaba
        .pipe(gulp.dest( function(file) {
            return file.base;
         } ));
        
};


// WATCH ================================================
gulp.task('watch', function() {
    gulp.watch( [path.contentRoot + '/**/*.scss', '!' + path.contentRoot + '/css/_if-settings.scss'], function(file){ createOrChangeCssFile(file);});
    gulp.watch( [path.views       + '/**/*.scss', '!' + path.contentRoot + '/css/_if-settings.scss'], function(file){ createOrChangeCssFile(file);});
    gulp.watch( path.contentRoot  + '/css/_if-settings.scss',                                         ['cssContent', 'cssViews'] );
});


// DEFAULT ================================================

gulp.task('default', function(callback) {
    runSequence(
        'watch',
    callback);
});