'use strict'

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    coffee  = require('gulp-coffee'),
    concat  = require('gulp-concat'),
    gutil   = require('gulp-util'),
    rename = require('gulp-rename'),
    filter = require('gulp-filter'),
    order = require('gulp-order'),
    mainBowerFiles = require('main-bower-files');

gulp.task('default', ['stylesheets', 'coffee', 'bower:js', 'bower:css'], function ()
{
  return;
})

gulp.task('stylesheets', function () {
  return gulp.src('src/stylesheets/application.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 10 versions'],
        cascade: false
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/css'))
})

gulp.task('coffee', function () {
  return gulp.src('src/javascripts/**/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .on('error', gutil.log)
})

gulp.task('bower:js', function () {
  var vendors = mainBowerFiles();
  return gulp.src(vendors)
    .pipe(filter('**.js'))
    .pipe(order(vendors))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/js'))
})

gulp.task('bower:css', function () {
  var vendors = mainBowerFiles();
  return gulp.src(vendors)
    .pipe(filter('**.css'))
    .pipe(order(vendors))
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('public/css'))
})