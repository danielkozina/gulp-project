let gulp = require('gulp'); // create gulp variable
let browserSync = require('browser-sync'); // create browser-sync variable
let sass = require('gulp-sass'); // create sass variable
let sourcemaps = require('gulp-sourcemaps'); // create source maps variable
let autoprefixer = require('gulp-autoprefixer'); // create autoprefixer variable
let cleanCSS = require('gulp-clean-css'); // create minify variable
let uglify = require('gulp-uglify'); // create variable for uglify
let gulpUtil = require('gulp-util');
let concat = require('gulp-concat');
let imagemin = require('gulp-imagemin'); 
let changed = require('gulp-change');
let htmlReplace = require('gulp-html-replace');
let htmlMin = require('gulp-htmlmin');
let del = require('del');
let sequence = require('run-sequence');

gulp.task('reload', function(){
    browserSync.reload();
});

// create first task in gulp -> 'gulp css' command
gulp.task('css', function(){    
    console.log('Zadanie CSS')
});

// create task with reload and watch on html and sass files
gulp.task('serve', ['sass'], function(){
    browserSync({
        server: 'src'
    });
    gulp.watch('src/*.html', ['reload']); // watch on all html files in src folder
    gulp.watch('src/scss/**/*.scss', ['sass']); // watch on all html files in src folder
});

gulp.task('sass', function(){
    return gulp.src('src/scss/**/*.scss')
            .pipe(sourcemaps.init()) //init source maps
            .pipe(sass().on('error', sass.logError)) // check errors
            .pipe(autoprefixer({
                browsers: ['last 3 versions']
            }))
            .pipe(sourcemaps.write()) // save sourcemaps hash code in style.css
            .pipe(gulp.dest('src/css')) // save in src/css
            .pipe(browserSync.stream()); // stream to browser
});

// css minify
gulp.task('css', function(){
    return gulp.src('src/css/**/*.css')
            .pipe(concat('style.css'))
            .pipe(cleanCSS())
            .pipe(gulp.dest('dist/css'));
});

// js minify
gulp.task('js', function(){
    return gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('script.js'))
        .pipe(uglify().on('error', gulpUtil.log)) // notice the error event here
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('img', function(){
    return gulp.src('src/img/**/*.{jpg,jpeg,png,gif}')
            // .pipe(changed('dist/img')) don't work yet
            .pipe(imagemin())
            .pipe(gulp.dest('dist/img'));
})

gulp.task('html', function(){
    return gulp.src('src/*.html')
        .pipe(htmlReplace({
            'css': 'css/style.css',
            'js': 'js/script.css'
        }))
        .pipe(htmlMin({
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist/'))
});

gulp.task('clean', function(){
    return del(['dist']);
});

gulp.task('build', function(){
    sequence('clean', ['html','js','css','img']);
});

//create default task in gulp -> 'gulp' command
gulp.task('default', ['serve']);