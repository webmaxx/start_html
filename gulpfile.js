var gulp = require('gulp'),
    babel = require('gulp-babel'),
    cleanCSS = require("gulp-clean-css"),
    ts = require('gulp-typescript'),
    uglify = require("gulp-uglify"),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    gcmq = require('gulp-group-css-media-queries'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    pugRender = require('gulp-pug'),
    nunjucksRender = require('gulp-nunjucks-render'),
    htmlBeautify = require('gulp-html-beautify'),
    autoprefixer = require("autoprefixer"),
    del = require('del'),
    smartgrid = require('smart-grid'),
    browserSync = require('browser-sync').create(),
    packageJson = require('./package.json');


/* Config */

var htmlMode = 'html',  // html, pug, njk
    cssMode = 'less',   // css, sass, scss, less
    jsMode = 'js',      // js, ts
    autoprefixerOptions = {
      // overrideBrowserslist: ["> 0.1%"]
    },
    smartgridUse = true,
    smartgridOptions = {
      outputStyle: cssMode,
      filename: '_smart-grid',
      columns: 12,
      offset: '30px',
      container: {
        maxWidth: '1140px',
        fields: '30px'
      }
    },
    htmlBeautifyOptions = {
      'indent_size': 2,
      'indent_char': " ",
      'eol': "\n",
      'indent_level': 0,
      'indent_with_tabs': false,
      'preserve_newlines': true,
      'max_preserve_newlines': 10,
      'jslint_happy': false,
      'space_after_anon_function': false,
      'brace_style': "collapse",
      'keep_array_indentation': false,
      'keep_function_indentation': false,
      'space_before_conditional': true,
      'break_chained_methods': false,
      'eval_code': false,
      'unescape_strings': false,
      'wrap_line_length': 0,
      'wrap_attributes': "auto",
      'wrap_attributes_indent_size': 4,
      'end_with_newline': false
    },
    htmlData = {
      // Custom data, uses in pug or nunjucks templates.
      //
      // varname: 'value'
      //
      // Examples:
      //   pug - #{varname}
      //   nunjucks - {{ varname }}
    };


/* HTML Tasks */

gulp.task('html:html', function() {
  return gulp.src('./app/templates/*.html')
    .pipe(htmlBeautify(htmlBeautifyOptions))
    .pipe(gulp.dest('./dist'))
    .on('end', browserSync.reload);
});

gulp.task('html:pug', function() {
  return gulp.src([
      './app/templates/*.pug',
      '!./app/templates/_*.pug'
    ])
    .pipe(plumber())
    .pipe(pugRender({
      data: htmlData
    }))
    .pipe(htmlBeautify(htmlBeautifyOptions))
    .pipe(gulp.dest('./dist'))
    .pipe(plumber())
    .on('end', browserSync.reload);
});

gulp.task('html:njk', function() {
  return gulp.src([
    './app/templates/*.njk',
    '!./app/templates/_*.njk'
  ])
    .pipe(plumber())
    .pipe(nunjucksRender({
      path: './app/templates',
      data: htmlData
    }))
    .pipe(htmlBeautify(htmlBeautifyOptions))
    .pipe(gulp.dest('./dist'))
    .pipe(plumber())
    .on('end', browserSync.reload);
});

gulp.task('html', gulp.parallel(`html:${htmlMode}`));


/* CSS Tasks */

gulp.task('css:css', function() {
  return gulp.src('./app/styles/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([
      autoprefixer(autoprefixerOptions)
    ]))
    .pipe(gcmq())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS({compatibility: "ie8", level: {1: {specialComments: 0}}}))
    .pipe(gulp.dest('./dist/css'))
    .on('end', browserSync.reload);
});

gulp.task('css:sass', function() {
  return gulp.src([
    `./app/styles/*.${cssMode}`,
    `!./app/styles/_*.${cssMode}`
  ])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(autoprefixerOptions)
    ]))
    .pipe(gcmq())
    .pipe(gulp.dest('./dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS({compatibility: "ie8", level: {2: {specialComments: 0}}}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
    .on('end', browserSync.reload);
});

gulp.task('css:scss', gulp.parallel('css:sass'));

gulp.task('css:less', function() {
  return gulp.src([
    './app/styles/*.less',
    '!./app/styles/_*.less'
  ])
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(autoprefixerOptions)
    ]))
    .pipe(gcmq())
    .pipe(gulp.dest('./dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS({compatibility: "ie8", level: {2: {specialComments: 0}}}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
    .on('end', browserSync.reload);
});

gulp.task('css', gulp.parallel(`css:${cssMode}`));

gulp.task('smartgrid', function() {
  return new Promise(function(resolve, reject) {
    if (smartgridUse) {
      smartgrid('app/styles', smartgridOptions);
    }
    resolve();
  });
});


/* JS Tasks */

gulp.task('js:js', function() {
  return gulp.src([
    './app/js/app.js'
  ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(babel({presets: ["@babel/preset-env"]}))
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'))
    .on('end', browserSync.reload);
});

gulp.task('js:ts', function() {
  return gulp.src('./app/js/**/*.ts')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(ts())
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'))
    .on('end', browserSync.reload);
});

gulp.task('js', gulp.parallel(`js:${jsMode}`));


/* Libs Tasks */

gulp.task('libs', function() {
  var modules = Object.keys(packageJson.dependencies),
      moduleFiles = modules.map(function(module) {
        return `./node_modules/${module}/**/*`;
      });

  return gulp.src(moduleFiles, {base: "./node_modules/"})
    .pipe(gulp.dest("./app/libs/"))
    .pipe(gulp.src(["./app/libs/**/*.{js,css,jpg,jpeg,png,gif,svg}"]))
    .pipe(gulp.dest("./dist/libs/"));
});


/* Images Tasks */

gulp.task('img', function() {
  return gulp.src('./app/img/**/*')
    .pipe(gulp.dest('./dist/img'))
    .on('end', browserSync.reload);
});


/* Fonts Tasks */

gulp.task('fonts', function() {
  return gulp.src('./app/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'))
    .on('end', browserSync.reload);
});



/* System Tasks */

gulp.task('clear', function() {
  return del(['./dist']);
});

gulp.task('watch', function() {
  gulp.watch(`./app/templates/**/*.${htmlMode}`, gulp.series('html'));
  gulp.watch(`./app/styles/**/*.${cssMode}`, gulp.series('css'));
  gulp.watch(`./app/js/**/*.${jsMode}`, gulp.series('js'));
  gulp.watch('./app/img/**/*', gulp.series('img'));
  gulp.watch('./app/fonts/**/*', gulp.series('fonts'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './dist',
      directory: true
    },
    notify: false
  });
});

gulp.task('default', gulp.series(
  gulp.parallel('clear'),
  gulp.parallel('smartgrid', 'libs'),
  gulp.parallel('html', 'js', 'css', 'img', 'fonts'),
  gulp.parallel('watch', 'serve')
));
