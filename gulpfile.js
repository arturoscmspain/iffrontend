// CONFIG  ========================================
var config  = {
    inmofactoryLocalPath : 'C:/gitscmspain/realestate-inmofactory/realestate-inmofactory/InmofactoryMVC4/'
};

// VARIABLES ========================================

var _contentScss    = config.inmofactoryLocalPath + 'Content/scss';
var _contentFolders = [
    config.inmofactoryLocalPath + 'Content/ModalSampleCode',
    config.inmofactoryLocalPath + 'Content/OV',
    config.inmofactoryLocalPath + 'Content/Publication',
    config.inmofactoryLocalPath + 'Content/Themes',
    config.inmofactoryLocalPath + 'Content/ui-redmond',
    config.inmofactoryLocalPath + 'Content/Vendor'
];

var _contentRoot     = config.inmofactoryLocalPath + 'Content';
var _views           = config.inmofactoryLocalPath + 'Views';


var _inmofactoryStylesAll     = _contentFolders.slice(0);; 
_inmofactoryStylesAll.push(_contentRoot);
_inmofactoryStylesAll.push(_views);

var path = {
    src         : 'src',
    dist        : 'dist',
    tmp         : '.tmp',
    srcStyles   : 'src/scss',
    distStyles  : 'dist/css',
    srcScripts  : 'src/js',
    distScripts : 'dist/js',
    srcImages   : 'src/img',
    distImages  : 'dist/img',
    
    
    test1 : 'C:/gitscmspain/if-frontend/legacy/css',
    test2 : 'C:/gitscmspain/if-frontend/legacy',


    contentScss : _contentScss,
    contentFolders : _contentFolders,
    contentRoot : _contentRoot,
    views : _views,
    inmofactoryStylesAll: _inmofactoryStylesAll,


    srcMainStyles               : 'src/scss/main.scss',

    //legacyStyles                : 'legacy/scss',
    //legacySiteBlockStyles       : 'legacy/scss/legacySiteBlock.scss',
    
    distInmofactoryLegacySiteBlockStyles   : config.inmofactoryLocalPath + 'Content/css/legacy',
    distInmofactorySiteBlockStyles         : config.inmofactoryLocalPath + 'Content/css/blocks'



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


// CLEAN ================================================
gulp.task('clean', function(callback) {
    del(
        [ path.tmp, path.dist + '/*' ],
        function(err, deletedFiles) {
            console.log('Files deleted:\n'.bold.green , deletedFiles.join(',\n '));
            callback();
    });
});

gulp.task('copy-html', function() {
    return gulp.src( path.src + '/**/**.html')
        .pipe(gulp.dest( path.dist ));
});
gulp.task('html', ['copy-html'], function() {
    return browsersync.reload();
});


// STYLES ===============================================
gulp.task('styles', function() {
    gulp.src( [ path.srcStyles + '/**/*.scss', '!src/scss/main.scss'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(sourcemaps.init())
        .pipe(postcss([ pxtorem({ replace: false,
                                  root_value: 10,
                                  prop_white_list: ['font', 'font-size']
         }) ]))
        //.pipe(minifyCss())
        //.pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest( path.distStyles ))
        .pipe(gulp.dest( path.distInmofactorySiteBlockStyles ));
});

// STYLES MAIN.scss ===============================================
gulp.task('mainStyles', function() {
    gulp.src( path.srcStyles + '/**/*.scss' )
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(sourcemaps.init())
        .pipe(postcss([ pxtorem({ replace: false,
                                  root_value: 10,
                                  prop_white_list: ['font', 'font-size']
         }) ]))
        //.pipe(minifyCss())
        //.pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest( path.distStyles ));
});

// SITEBLOCK LEGACYSITEBLOCK.scss ================================================

// gulp.task('legacySiteBlockStyles', function(){
//     gulp.src(path.legacySiteBlockStyles)
//          .pipe(plumber({
//             errorHandler: onError
//         }))
//         .pipe(sass())
//         .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
//         .pipe(sourcemaps.init())
//         .pipe(postcss([ pxtorem({ replace: false,
//                                   root_value: 10,
//                                   prop_white_list: ['font', 'font-size']
//          }) ]))
//         //.pipe(minifyCss())
//         //.pipe(rename({suffix: '.min'}))
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest( path.distStyles ))
//         .pipe(gulp.dest( path.distInmofactoryLegacySiteBlockStyles ));
// });



// SCRIPTS ==============================================
gulp.task('js', function() {
    gulp.src( path.srcScripts + '/**/*.js' )
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest( path.distScripts ))
        .pipe(rename({suffix: '.min'}));
});

// IMAGES ===============================================
gulp.task('images', function() {
    return gulp.src( path.srcImages + '/**/**.{png,gif,jpg,svg}')
        .pipe(gulp.dest( path.distImages ));
});


// BROWSER SYNC =========================================
gulp.task('browsersync', function() {
    browsersync({
        server: { baseDir: path.dist },
        port: 8000,
        files: [
            path.distStyles + '/*.css',
            path.distScripts + '**/*.js'
        ]
    })
});

// IFSETTINGS de Inmofactory (archivo de variables sass para todo el proyecto) ===============================================
gulp.task('cssContent', function() {
    gulp.src( path.contentRoot + '/css/**/*.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        //.pipe(sourcemaps.init())
        .pipe(postcss([ pxtorem({ replace: false,
                                  root_value: 10,
                                  prop_white_list: ['font', 'font-size']
         }) ]))
        //.pipe(minifyCss())
        //.pipe(rename({suffix: '.min'}))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest( path.contentRoot + '/css' ));
});


gulp.task('cssViews', function() {
    gulp.src(path.views + '/Publication/**/*.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        //.pipe(sourcemaps.init())
        .pipe(postcss([ pxtorem({ replace: false,
                                  root_value: 10,
                                  prop_white_list: ['font', 'font-size']
         }) ]))
        //.pipe(minifyCss())
        //.pipe(rename({suffix: '.min'}))
        //.pipe(sourcemaps.write())
         .pipe(gulp.dest( path.views + '/Publication' ));
});


function createOrChangeCssFile(file){
    gulp.src(file.path)
         .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        //.pipe(sourcemaps.init())
        .pipe(postcss([ pxtorem({ replace: false,
                                  root_value: 10,
                                  prop_white_list: ['font', 'font-size']
         }) ]))
        //.pipe(minifyCss())
        //.pipe(rename({suffix: '.min'}))
        //.pipe(sourcemaps.write())
        //Deja el fichero alojado en el mismo directorio donde estaba
        .pipe(gulp.dest( function(file) {
            return file.base;
         } ));
        
};


// WATCH ================================================
//gulp.task('watch', ['browsersync'], function() {
gulp.task('watch', function() {
    //gulp.watch( path.src + '/**/*.{html,yml}',              ['html'] );
    // gulp.watch( [path.srcStyles + '/**/*.scss', '!src/scss/main.scss'],              ['styles'] );
    // gulp.watch( path.srcStyles + '/**/*.scss',              ['mainStyles'] );
    
    gulp.watch( [path.contentRoot + '/**/*.scss', '!' + path.contentRoot + '/css/_if-settings.scss'], function(file){ createOrChangeCssFile(file);});
    gulp.watch( [path.views + '/**/*.scss', '!' + path.contentRoot + '/css/_if-settings.scss'], function(file){ createOrChangeCssFile(file);});
    gulp.watch( path.contentRoot + '/css/_if-settings.scss',                ['cssContent', 'cssViews'] );
    // gulp.watch( path.srcScripts + '/**/*.js',               ['js'] );
    // gulp.watch( path.srcImages + '/**/*.{png,gif,jpg,svg}', ['img'] );
});


// BUILD ================================================
gulp.task('build', function(callback) {
    runSequence(
        'clean',
        [
            'html',
            'styles',
            'js',
            'images'
        ],
    callback);
});

// gulp.task('default', function(callback) {
//     runSequence(
//         'build',
//         ['watch'],
//     callback);
// });

gulp.task('default', function(callback) {
    runSequence(
        'watch',
    callback);
});