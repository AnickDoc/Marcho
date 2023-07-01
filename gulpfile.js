const {
  src,
  dest,
  watch,
  parallel,
  series
} = require('gulp');

const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const ttf2woff2 = require('gulp-ttf2woff2');
const ttf2woff = require('gulp-ttf2woff');
const gulpStylelint = require('gulp-stylelint');

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
};

function cleanDist() {
  return del('dist')

};

function fonts() {
  src('app/fonts/*.ttf')
    .pipe(ttf2woff())
    .pipe(dest('app/fonts/'))
  return src('app/fonts/*.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts/'));
};

function images() {
  return src('app/images/**/*')
    .pipe(imagemin(
      [
        imagemin.gifsicle({
          interlaced: true
        }),
        imagemin.mozjpeg({
          quality: 75,
          progressive: true
        }),
        imagemin.optipng({
          optimizationLevel: 5
        }),
        imagemin.svgo({
          plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
          ]
        })
      ]
    ))
    .pipe(dest('dist/images'))

};

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
    'node_modules/rateyo/src/jquery.rateyo.js',
    'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
    'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
    'app/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
};


function styles() {
  return src('app/scss/**/*.scss')
    .pipe(scss({
      outputStyle: 'compressed'
    }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
};

function build() {
  return src([
    'app/css/style.min.css',
    'app/fonts/**/*.woff',
    'app/fonts/**/*.woff2',
    'app/js/main.min.js',
    'app/*.html'
  ], {
    base: 'app'
  })
    .pipe(dest('dist'))
};

function wathing() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/fonts/**/*.ttf'], fonts);
  watch(['app/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/*.html']).on('change', browserSync.reload);
};

exports.styles = styles;
exports.wathing = wathing;
exports.fonts = fonts;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;


exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, fonts, browsersync, wathing);