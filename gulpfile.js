let gulp = require('gulp'); // create gulp variable
let browserSync = require('browser-sync'); // create browser-sync variable
let sass = require('gulp-sass'); // create sass variable
let sourcemaps = require('gulp-sourcemaps'); // create source maps variable
let autoprefixer = require('gulp-autoprefixer'); // create autoprefixer variable
let cleanCSS = require('gulp-clean-css'); // create minify variable
let uglify = require('gulp-uglify'); // create variable for uglify

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

gulp.task('css', function(){
    return gulp.src('src/css/**/*.css')
            .pipe(cleanCSS())
            .pipe(gulp.dest('dist/css'))
});

gulp.task('js', function(){
    return gulp.src('src/js/**/*.js')
            .pipe(uglify())
            .pipe(gulp.dest('dist/js'));
});
//create default task in gulp -> 'gulp' command
gulp.task('default', ['serve']);