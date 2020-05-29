const gulp = require('gulp');
const plumber = require('gulp-plumber');
const fileInclude = require('gulp-file-include');
const pug = require('gulp-pug');
const nunjucks = require('gulp-nunjucks-render');
const htmlPretty = require('gulp-pretty-html');
const smartGrid = require('smart-grid');
const less = require('gulp-less');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require("autoprefixer");
const gcmq = require('gulp-group-css-media-queries');
const cleanCss = require('gulp-clean-css');
const webpack = require('webpack-stream');
const vinylNamed = require('vinyl-named');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const util = require('gulp-util');
const del = require('del');
const browserSync = require('browser-sync').create();
const packageJson = require('./package.json');
const path = require('path');

/******************************************************************************/
/** Config                                                                    */
/******************************************************************************/

const config = {
    htmlMode: 'njk',       // html, pug, njk
    stylesMode: 'less',    // css, sass, scss, less
    // scriptsMode: 'js',     // js, ts (not used at the moment)

    /**
     * CSS files for concatenation (used only if stylesMode == 'css')
     */
    cssFiles: [
        './app/libs/normalize.css/normalize.css',
        './app/styles/base/variables.css',
        './app/styles/base/animate.css',
        './app/styles/base/fonts.css',
        './app/styles/base/app.css',
        './app/styles/base/typography.css',
        './app/styles/partials/header.css',
        './app/styles/partials/main.css',
        './app/styles/partials/footer.css',
        './app/styles/app.css'
    ],
    cssOutputFilename: 'app.css',

    folders: {
        /**
         * Folders for src files
         */
        app: {
            base: './app',
            templates: 'templates',
            styles: 'styles',
            scripts: 'scripts',
            images: 'img',
            fonts: 'fonts',
            libs: 'libs'
        },

        /**
         * Folders for build
         */
        build: {
            base: './build',
            templates: '',
            styles: 'css',
            scripts: 'js',
            images: 'img',
            fonts: 'fonts',
            libs: 'libs'
        },

        /**
         * Folders for development (default - inherits build settings)
         */
        dist: {
            base: './dist'
        }
    },

    /**
     * SmartGrid settings
     */
    smartgridUse: true,
    smartgridOptions: {
        filename: '_smart-grid',
        outputStyle: this.stylesMode,
        columns: 12,
        offset: "30px",
        mobileFirst: false,
        container: {
            maxWidth: "1280px",
            fields: "30px"
        },
        breakPoints: {
            lg: {
                width: "1200px"
            },
            md: {
                width: "992px",
                fields: "15px"
            },
            sm: {
                width: "720px"
            },
            xs: {
                width: "576px"
            }
        },
        mixinNames: {
            container: "wrapper",
            row: "row-flex",
            rowFloat: "row-float",
            rowInlineBlock: "row-ib",
            rowOffsets: "row-offsets",
            column: "col",
            size: "size",
            columnFloat: "col-float",
            columnInlineBlock: "col-ib",
            columnPadding: "col-padding",
            columnOffsets: "col-offsets",
            shift: "shift",
            from: "from",
            to: "to",
            fromTo: "from-to",
            reset: "reset",
            clearfix: "clearfix",
            debug: "debug",
            uRowFlex: "u-row-flex",
            uColumn: "u-col",
            uSize: "u-size"
        },
        tab: "    ",
        defaultMediaDevice: "screen",
        detailedCalc: false
    },

    autoprefixerOptions: {
        // overrideBrowserslist: ["> 0.1%"]
    },

    htmlPrettyOptions: {
        // indent_size: 4,                  // Indentation size [4]
        // indent_char: " ",                // Indentation character [" "]
        // indent_with_tabs: " ",           // Indent with tabs, overrides -s and -c
        // eol: "\\n",                      // Character(s) to use as line terminators. (default newline - "\\n")
        // end_with_newline: true,          // End output with newline
        // preserve_newlines: true,         // Preserve existing line-breaks (--no-preserve-newlines disables)
        // max_preserve_newlines: 10,       // Maximum number of line-breaks to be preserved in one chunk [10]
        // indent_inner_html: false,        // Indent <head> and <body> sections. Default is false.
        // brace_style: 'collapse',         // [collapse-preserve-inline|collapse|expand|end-expand|none] ["collapse"]
        // indent_scripts: 'normal',        // [keep|separate|normal] ["normal"]
        // wrap_line_length: 250,           // Maximum characters per line (0 disables) [250]
        // wrap_attributes: 'auto',         // Wrap attributes to new lines [auto|force|force-aligned|force-expand-multiline] ["auto"]
        // wrap_attributes_indent_size: 4,  // Indent wrapped attributes to after N characters [indent-size] (ignored if wrap-attributes is "force-aligned")
        // unformatted: [],                 // List of tags (defaults to inline) that should not be reformatted
        // content_unformatted: [],         // List of tags (defaults to pre) whose content should not be reformatted
        // extra_liners: []                 // List of tags (defaults to [head,body,/html] that should have an extra newline before them.
    },

    /**
     * Custom data, uses in templates.
     *
     * Use in templates:
     *     html - @@varname
     *     pug - #{varname}
     *     nunjucks - {{ varname }}
     *
     */
    htmlData: {
        sitename: "Start HTML template"
    }
};

config.folders.dist.templates = config.folders.dist.templates || config.folders.build.templates;
config.folders.dist.styles = config.folders.dist.styles || config.folders.build.styles;
config.folders.dist.scripts = config.folders.dist.scripts || config.folders.build.scripts;
config.folders.dist.images = config.folders.dist.images || config.folders.build.images;
config.folders.dist.fonts = config.folders.dist.fonts || config.folders.build.fonts;
config.folders.dist.libs = config.folders.dist.libs || config.folders.build.libs;

config.smartgridOptions.outputStyle = config.stylesMode;

/******************************************************************************/
/** Environment (not change)                                                  */
/******************************************************************************/

const ENV = {
    mode: util.env.env || 'production',
    isDev: false,
    isProd: true,
    outputMode: 'build'
};

ENV.isDev = (ENV.mode == 'dev' || ENV.mode == 'development');
ENV.isProd = !ENV.isDev;

/******************************************************************************/
/** HTML                                                                      */
/******************************************************************************/

const html = {
    html: function() {
        const task = html._init()
            .pipe(fileInclude({
                prefix: '@@',
                basepath: `${utils.appPath('templates')}/includes`,
                context: config.htmlData
            }))
        ;
        return html._output(task);
    },

    pug: function() {
        const task = html._init()
            .pipe(pug({
                data: config.htmlData
            }))
        ;
        return html._output(task);
    },

    njk: function() {
        const task = html._init()
            .pipe(nunjucks({
                path: utils.appPath('templates'),
                data: config.htmlData
            }))
        ;
        return html._output(task);
    },

    _init: function() {
        return gulp.src([
            `${utils.appPath('templates')}/*.${config.htmlMode}`,
            `!${utils.appPath('templates')}/_*.${config.htmlMode}`
        ]).pipe(plumber());
    },

    _output: function(task) {
        return task
            .pipe(htmlPretty(config.htmlPrettyOptions))
            .pipe(gulp.dest(utils.outputPath('templates')))
        ;
    }
};

html.html.displayName = 'html:html';
html.pug.displayName = 'html:pug';
html.njk.displayName = 'html:njk';

/******************************************************************************/
/** Styles                                                                       */
/******************************************************************************/

const styles = {
    css: function() {
        const task = gulp.src(config.cssFiles, {
            sourcemaps: ENV.isDev
        }).pipe(concat(config.cssOutputFilename));
        return styles._output(task);
    },

    less: function() {
        const task = styles._init().pipe(less());
        return styles._output(task);
    },

    sass: function() {
        const task = styles._init().pipe(sass());
        return styles._output(task);
    },

    scss: function() {
        return styles.sass();
    },

    _init: function() {
        return gulp.src([
            `${utils.appPath('styles')}/*.${config.stylesMode}`,
            `!${utils.appPath('styles')}/_*.${config.stylesMode}`
        ], {
            sourcemaps: ENV.isDev
        });
    },

    _output: function(task) {
        return task
            .pipe(postcss([
                autoprefixer(config.autoprefixerOptions)
            ]))
            .pipe(gcmq())
            .pipe(gulp.dest(utils.outputPath('styles'), {
                sourcemaps: ENV.isDev
            }))
            .pipe(cleanCss())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(utils.outputPath('styles'), {
                sourcemaps: ENV.isDev ? '.' : false
            }))
        ;
    }
};

styles.css.displayName = 'styles:css';
styles.less.displayName = 'styles:less';
styles.sass.displayName = 'styles:sass';
styles.scss.displayName = 'styles:scss';

/******************************************************************************/
/** Scripts                                                                   */
/******************************************************************************/

const scripts = {
    compile: function() {
        return gulp.src([
                `${utils.appPath('scripts')}/*.{js,ts,tsx}`,
                `!${utils.appPath('scripts')}/_*.{js,ts,tsx}`
            ])
            .pipe(vinylNamed())
            .pipe(webpack({
                output: {
                    filename: '[name].js'
                },
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            loader: 'babel-loader',
                            include: path.resolve(__dirname, utils.appPath('scripts')),
                            exclude: '/node_modules/'
                        },
                        {
                            test: /\.tsx?$/,
                            loaders: [
                                'babel-loader',
                                {
                                    loader: 'ts-loader',
                                    options: {
                                        transpileOnly: true,
                                        experimentalWatchApi: true,
                                    }
                                }
                            ],
                            include: path.resolve(__dirname, utils.appPath('scripts')),
                            exclude: /node_modules/,
                        }
                    ]
                },
                resolve: {
                    extensions: [".ts", ".tsx", ".js"]
                },
                mode: ENV.isProd ? 'production' : 'development',
                devtool: ENV.isDev ? 'eval-source-map' : 'none'
            }))
            .pipe(gulp.dest(utils.outputPath('scripts')))
        ;
    }
};

scripts.compile.displayName = 'scripts:compile';

/******************************************************************************/
/** SmartGrid                                                                 */
/******************************************************************************/

const smartgrid = {
    create: function(cb) {
        if (config.smartgridUse && config.stylesMode != 'css') {
            smartGrid(utils.appPath('styles'), config.smartgridOptions);
        }
        cb();
    }
};

smartgrid.create.displayName = 'smartgrid:create';

/******************************************************************************/
/** Libraries                                                                 */
/******************************************************************************/

const libs = {
    publish: function(cb) {
        let modules = Object.keys(packageJson.dependencies).map(function(module) {
          return `./node_modules/${module}/**/*`;
        });

        if (modules.length) {
            return gulp.src(modules, {
                    base: "./node_modules/"}
                )
                .pipe(gulp.dest(utils.appPath('libs')))
                .pipe(gulp.dest(utils.outputPath('libs')));
        }

        cb();
    }
};

libs.publish.displayName = 'libs:publish';

/******************************************************************************/
/** Images                                                                    */
/******************************************************************************/

const images = {
    publish: function() {
        return gulp.src(`${utils.appPath('images')}/**/*`, {
                since: gulp.lastRun(images.publish)
            })
            .pipe(gulp.dest(utils.outputPath('images')))
        ;
    }
};

images.publish.displayName = 'images:publish';

/******************************************************************************/
/** Fonts                                                                     */
/******************************************************************************/

const fonts = {
    publish: function() {
        return gulp.src(`${utils.appPath('fonts')}/**/*`, {
                since: gulp.lastRun(fonts.publish)
            })
            .pipe(gulp.dest(utils.outputPath('fonts')))
        ;
    }
};

fonts.publish.displayName = 'fonts:publish';

/******************************************************************************/
/** Server                                                                    */
/******************************************************************************/

const server = {
    start: function(cb) {
        browserSync.init({
            server: {
                baseDir: utils.outputPath('base'),
                directory: true
            },
            notify: false
        });
        cb();
    },

    reload: function(cb) {
        browserSync.reload();
        cb();
    },

    watch: function() {
        gulp.watch(`${utils.appPath('templates')}/**/*`, gulp.series(html[config.htmlMode], server.reload));
        gulp.watch(`${utils.appPath('styles')}/**/*`, gulp.series(styles[config.stylesMode], server.reload));
        gulp.watch(`${utils.appPath('scripts')}/**/*`, gulp.series(scripts.compile, server.reload));
        gulp.watch(`${utils.appPath('images')}/**/*`, gulp.series(images.publish, server.reload));
        gulp.watch(`${utils.appPath('fonts')}/**/*`, gulp.series(fonts.publish, server.reload));
    }
};

server.start.displayName = 'server:start';
server.reload.displayName = 'server:reload';
server.watch.displayName = 'server:watch';

/******************************************************************************/
/** Utils                                                                     */
/******************************************************************************/

const utils = {
    setOutputModeAsBuild: function(cb) {
        ENV.outputMode = 'build';
        cb();
    },

    setOutputModeAsWatch: function(cb) {
        ENV.outputMode = 'dist';
        cb();
    },

    appPath: function(folder) {
        return utils.outputPath(folder, 'app');
    },

    outputPath: function(folder, root) {
        root = root || ENV.outputMode;

        if (folder == 'base') {
            return config.folders[root][folder];
        } else {
            return `${config.folders[root]['base']}/${config.folders[root][folder]}`;
        }
    },

    clean: function() {
        return del([utils.outputPath('base')]);
    }
};

/******************************************************************************/
/** Tasks                                                                     */
/******************************************************************************/

exports.watch = gulp.series(
    utils.setOutputModeAsWatch,
    utils.clean,
    gulp.parallel(
        smartgrid.create,
        libs.publish
    ),
    gulp.parallel(
        html[config.htmlMode],
        styles[config.stylesMode],
        scripts.compile,
        images.publish,
        fonts.publish
    ),
    server.start,
    server.watch
);

exports.default = exports.build = gulp.series(
    utils.setOutputModeAsBuild,
    utils.clean,
    gulp.parallel(
        smartgrid.create,
        libs.publish
    ),
    gulp.parallel(
        html[config.htmlMode],
        styles[config.stylesMode],
        scripts.compile,
        images.publish,
        fonts.publish
    )
);
