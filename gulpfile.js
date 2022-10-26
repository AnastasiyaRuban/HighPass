const project_folder = require('path').basename(__dirname);
const source_folder = '#src';

const path = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/',
    fonts: project_folder + '/fonts/',
    resources: project_folder + '/resources/',
    favicon: project_folder,
  },
  src: {
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
    css: [
      source_folder + '/scss/**/*.scss',
      '!' + source_folder + '/scss/breakpoints/**.**',
    ],
    breakpoint: source_folder + '/scss/breakpoints/**.**',
    js: source_folder + '/js/script.js',
    img: source_folder + '/img/**/*.{jpg, png, gif, ico, webp}',
    fonts: source_folder + '/fonts/**/*.{ttf, woff, woff2}',
    resources: source_folder + '/resources/**.**',
    favicon: source_folder + '/resources/favicon.**',
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,gif,ico,webp}',
    breakpoint: source_folder + '/scss/breakpoints/**.**',
  },
  clean: './' + project_folder + '/',
};
const { src, dest } = require('gulp');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const groupsMedia = require('gulp-group-css-media-queries');
const clean_css = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const imagemin = require('gulp-image');
const webp = require('gulp-webp');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const svgSprite = require('gulp-svg-sprite');
const fonter = require('gulp-fonter');
const concat = require('gulp-concat');
const soursemaps = require('gulp-sourcemaps');

const browsersync = () => {
  browserSync.init({
    server: {
      baseDir: './' + project_folder + '/',
    },
    port: 3000,
    notify: false,
  });
};

const html = () => {
  return src(path.src.html)
    .pipe(fileInclude())
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
};

watchFiles = () => {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
  gulp.watch([path.watch.breakpoint], breakpoints);
};

const clean = () => {
  return del(path.clean);
};

const favicon = () => {
  return src(path.src.favicon).pipe(dest(path.build.favicon));
};
const resources = () => {
  return src(path.src.resources).pipe(dest(path.build.resources));
};

const css = () => {
  return src(path.src.css)
    .pipe(soursemaps.init())
    .pipe(concat('main.css'))
    .pipe(
      sass({
        outputStyle: 'expanded',
      })
    )
    .pipe(
      autoprefixer({
        overrBrowsersList: ['Last 5 versions'],
        cascade: true,
      })
    )
    .pipe(concat('main.css')) //
    .pipe(soursemaps.write())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: '.min.css',
      })
    )
    .pipe(soursemaps.write())
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
};

const breakpoints = () => {
  return src(path.src.breakpoint)
    .pipe(soursemaps.init())
    .pipe(concat('media.css'))

    .pipe(
      sass({
        outputStyle: 'expanded',
      })
    )
    .pipe(
      autoprefixer({
        overrBrowsersList: ['Last 5 versions'],
        cascade: true,
      })
    )
    .pipe(soursemaps.write())
    .pipe(groupsMedia())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: '.min.css',
      })
    )
    .pipe(soursemaps.write())
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
};

const js = () => {
  return src(path.src.js)
    .pipe(soursemaps.init())
    .pipe(fileInclude())
    .pipe(soursemaps.write())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js',
      })
    )
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(soursemaps.write())
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream());
};

const images = () => {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeVieBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream());
};

const svgSprites = () => {
  return gulp
    .src([source_folder + '/iconsprite/*.svg'])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../icons/icons.svg',
            example: true,
          },
        },
      })
    )
    .pipe(dest(path.build.img));
};

const fonts = () => {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
};

gulp.task('otf2ttf', () => {
  return src([source_folder + '/fonts/*.otf'])
    .pipe(
      fonter({
        subset: [66, 67, 68, 69, 70, 71],
        formats: ['ttf'],
      })
    )
    .pipe(dest(source_folder + '/fonts/'));
});

const build = gulp.series(
  clean,
  svgSprites,
  resources,
  favicon,
  gulp.parallel(js, css, breakpoints, html, images, fonts)
);
const watch = gulp.parallel(build, watchFiles, browsersync);

exports.watch = watch;
exports.build = build;

exports.breakpoints = breakpoints;
exports.favicon = favicon;
exports.resources = resources;
exports.svgSprites = svgSprites;
exports.fonts = fonts;
exports.images = images;
exports.html = html;
exports.css = css;
exports.js = js;
exports.default = watch;
