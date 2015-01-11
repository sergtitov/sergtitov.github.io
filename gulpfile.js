var gulp        = require('gulp');
var deploy      = require('gulp-gh-pages');
var ejs         = require("gulp-ejs");
var gutil       = require('gulp-util');
var livereload  = require('gulp-livereload');
var express     = require('express');

var config      = require('./config.json');

/**
 *  Templates
 */
gulp.task('templates', function(){
    gulp.src([config.templates])
        .pipe(ejs(config.data)).on('error', gutil.log)
        .pipe(gulp.dest(config.buildpath));
});

/**
 *  Blog posts
 */
gulp.task('blog', function(){
    gulp.src([config.blog])
        .pipe(ejs(config.data)).on('error', gutil.log)
        .pipe(gulp.dest(config.buildpath));
});

/**
 *  HTML
 */
gulp.task('html', function(){
    gulp.src([config.src + '/*.html', config.src + '/CNAME'])
        .pipe(gulp.dest(config.buildpath));
});

/**
 *  Assets
 */
gulp.task('assets', function(){
    gulp.src([config.assets])
        .pipe(gulp.dest(config.buildpath + '/assets'));
});

/**
 *  Build
 */
gulp.task('build', ['templates', 'html', 'assets'], function() {
});

/**
 *  Server
 */
gulp.task('server', function(next) {
    server = express();
    server.use(express.static(config.buildpath)).listen(process.env.PORT || 9000, next);
});

/**
 *  Watch
 */
gulp.task('watch', ['server'], function() {
    var server = livereload();

    // watch source
    gulp.watch(config.src + '/**', ['build']);

    // watch destination
    gulp.watch(config.buildpath + '/**').on('change', function(file) {
        server.changed(file.path);
    });
});

/**
 *  Default
 */
gulp.task('default', ['build', 'watch'], function() {
});

/**
 *  Push build to gh-pages
 */
gulp.task('deploy', function () {
    return gulp.src(config.buildpath + '/**/*')
        .pipe(deploy())
});