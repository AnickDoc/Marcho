const {
  src,
  dest,
  watch,
  parallel,
  series
} = require('gulp');

const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
//const ttf2woff2 = require('gulp-ttf2woff2');
//const ttf2woff = require('gulp-ttf2woff');
const gulpStylelint = require('gulp-stylelint');
const sass = require('gulp-sass')(require('sass'));

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'docs/'
    }
  });
};

function cleanDist() {
  return del('dist')

};

//function fonts() {
//  src('docs/fonts/*.ttf')
//    .pipe(ttf2woff())
//    .pipe(dest('docs/fonts/'))
//  return src('docs/fonts/*.ttf')
//    .pipe(ttf2woff2())
//    .pipe(dest('docs/fonts/'));
//};

function images() {
  return src('docs/images/**/*')
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
    'docs/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('docs/js'))
    .pipe(browserSync.stream())
};


function styles() {
  return src('docs/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(dest('docs/css'))
    .pipe(browserSync.stream())
};

function build() {
  return src([
    'docs/css/style.min.css',
    'docs/fonts/**/*.woff',
    'docs/fonts/**/*.woff2',
    'docs/js/main.min.js',
    'docs/*.html'
  ], {
    base: 'docs'
  })
    .pipe(dest('dist'))
};

function wathing() {
  watch(['docs/scss/**/*.scss'], styles);
  //watch(['docs/fonts/**/*.ttf'], fonts);
  watch(['docs/**/*.js', '!docs/js/main.min.js'], scripts);
  watch(['docs/*.html']).on('change', browserSync.reload);
};

exports.styles = styles;
exports.wathing = wathing;
//exports.fonts = fonts;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;


exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, wathing);