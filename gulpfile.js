'use strict'

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    coffee  = require('gulp-coffee'),
    concat  = require('gulp-concat'),
    gutil   = require('gulp-util'),
    rename = require('gulp-rename');

gulp.task('default', ['stylesheets', 'coffee'], function ()
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
