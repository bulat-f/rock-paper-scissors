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
    mainBowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    connect = require('gulp-connect'),
    haml = require('gulp-haml'),
    less = require('gulp-less'),
    path = require('path');

var config =
  {
    root: 'public/',
    cssDir: 'css/',
    fontsDir: 'css/fonts/',
    jsDir: 'js/',
    htmlDir: '',
    cssFile: '**/*.css',
    jsFile: '**/*.js',
    htmlFile: 'index.html',
    path: function (asset) {
      return this.root + this[asset + 'Dir']
    },
    cssPath: function () {
      return this.path('css')
    },
    fontsPath: function () {
      return this.path('fonts')
    },
    jsPath: function () {
      return this.path('js')
    },
    htmlPath: function () {
      return this.path('html')
    },
    libPath: function (asset) {
      return this[asset + 'Path']() + '/lib'
    },
    cssLibPath: function () {
      return this.libPath('css')
    },
    fontsLibPath: function () {
      return this.path('fonts')
    },
    jsLibPath: function () {
      return this.libPath('js')
    },
    filePath: function (asset) {
      return this[asset + 'Dir'] + this[asset + 'File']
    },
    cssFilePath: function () {
      return this.filePath('css')
    },
    jsFilePath: function () {
      return this.filePath('js')
    },
    htmlFilePath: function () {
      return this.filePath('html')
    },
    paths: ['public/css/**/*.css', 'public/js/app.min.js', 'public/index.html']
  }

var src = {
  root: 'src/',
  sassDir: 'stylesheets/',
  coffeeDir: 'javascripts/',
  hamlDir: 'haml/',
  sassFile: '**/*.scss',
  coffeeFile: '**/*.coffee',
  hamlFile: 'index.haml',
  path: function (asset) {
    return this.root + this[asset + 'Dir'] + this[asset + 'File']
  },
  sass: function () {
    return this.path('sass')
  },
  coffee: function () {
    return this.path('coffee')
  },
  index: function () {
    return this.path('haml')
  }
}

gulp.task('default', ['connect', 'watch', 'stylesheets', 'javascripts', 'haml'])

gulp.task('stylesheets', ['sass', 'bower:css', 'bower:less', 'bower:fonts'])

gulp.task('javascripts', ['coffee', 'bower:js'])

gulp.task('sass', function () {
  return gulp.src('src/stylesheets/application.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 10 versions'],
        cascade: false
    }))
    .pipe(gulp.dest(config.cssPath()))
    .pipe(connect.reload())
})

gulp.task('coffee', function () {
  return gulp.src('src/javascripts/**/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(concat('application.js'))
    .pipe(gulp.dest(config.jsPath()))
    .on('error', gutil.log)
    .pipe(connect.reload())
})

gulp.task('bower:js', function () {
  var vendors = mainBowerFiles();
  return gulp.src(vendors)
    .pipe(filter('**/*.js'))
    .pipe(order(vendors))
    .pipe(gulp.dest(config.jsLibPath()))
})

gulp.task('bower:css', function () {
  var vendors = mainBowerFiles();
  return gulp.src(vendors)
    .pipe(filter('**/*.css'))
    .pipe(order(vendors))
    .pipe(gulp.dest(config.cssLibPath()))
})

gulp.task('bower:less', function () {
  var vendors = mainBowerFiles();
  return gulp.src(vendors)
    .pipe(filter('**/*.less'))
    .pipe(order(vendors))
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest(config.cssLibPath()))
})

gulp.task('bower:fonts', function () {
  var vendors = mainBowerFiles();
  return gulp.src(vendors)
    .pipe(filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe(order(vendors))
    .pipe(gulp.dest(config.fontsLibPath()))
})

gulp.task('haml', function () {
  var target = gulp.src(src.index());
  var sources = gulp.src([config.jsFilePath(), config.cssFilePath()], {cwd: config.root, read: false});
 
  return target.pipe(inject(sources))
    .pipe(haml())
    .pipe(gulp.dest(config.htmlPath()))
    .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: 'public',
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(src.index(), ['haml']);
  gulp.watch(src.sass(), ['sass']);
  gulp.watch(src.coffee(), ['coffee']);
})