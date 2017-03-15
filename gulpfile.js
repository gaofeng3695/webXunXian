var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require("gulp-uglify");
var minifyCss = require("gulp-minify-css");
var minifyHtml = require("gulp-minify-html");
var imagemin = require('gulp-imagemin');


gulp.task('html', function() {
    gulp.src(['./**/*.html', '!{node_modules,demo,www}/**/*.html'])
        .pipe(minifyHtml()) //压缩
        .pipe(gulp.dest('www/'));
});

gulp.task('css', function() {
    gulp.src(['{src,lib}/**/*.css'])
        .pipe(minifyCss()) //压缩css
        .pipe(gulp.dest('www/'));
});

gulp.task('js', function() {
    gulp.src(['{src,lib}/**/*.js'])
        .pipe(uglify().on('error', function(e) {
            console.log(e);
        }))
        .pipe(gulp.dest('www/'));
});

gulp.task('img', function() {
    gulp.src(['{src,lib}/**/*.{jpg,gif,png}'])
        .pipe(imagemin())
        .pipe(gulp.dest('www/'));
});

gulp.task('font', function() {
    gulp.src(['{src,lib}/**/*.{otf,eot,svg,ttf,woff,woff2}'])
        .pipe(gulp.dest('www/'));
});

gulp.task('ico', function() {
    gulp.src(['./**.ico'])
        .pipe(gulp.dest('www/'));
});


gulp.task('sass', function() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('sass:watch', function() {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('all', ['html', 'css', 'js', 'img', 'font', 'ico']);