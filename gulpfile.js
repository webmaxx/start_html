var gulp           = require('gulp'),
    plumber        = require('gulp-plumber'),
    gutil          = require('gulp-util' ),
    concat         = require('gulp-concat'),
    pug            = require('gulp-pug'),
    fileinclude    = require('gulp-file-include'),
    nunjucksRender = require('gulp-nunjucks-render'),
    htmlbeautify   = require('gulp-html-beautify'),
    sass           = require('gulp-sass'),
    autoprefixer   = require('gulp-autoprefixer'),
    gcmq           = require('gulp-group-css-media-queries'),
    cleanCSS       = require('gulp-clean-css'),
    uglify         = require('gulp-uglify'),
    rename         = require('gulp-rename'),
    cache          = require('gulp-cache'),
    notify         = require('gulp-notify'),
    rsync          = require('gulp-rsync'),
    sftp           = require('gulp-sftp'),
    imagemin       = require('gulp-imagemin'),
    pngquant       = require('imagemin-pngquant'),
    del            = require('del'),
    smartgrid      = require('smart-grid'),
    browserSync    = require('browser-sync');

var deployMethod = 'rsync'; // rsync, sftp

var templatesType = 'html'; // html, pug, njk

var rsyncSettings = {
    root: 'dist/',
    hostname: 'sitename.ru',
    // username: 'username',
    destination: 'path/to/site/'
};

var sftpSettings = {
    host: 'sitename.ru',
    remotePath: '/',
    port: 22,
    authFile: '.sftppass',
    auth: 'keyMain'
};

var smartgridSettings = {
    "filename": '_smart-grid',
    outputStyle: 'sass', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: "30px", /* gutter width px || % */
    container: {
        maxWidth: '1280px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        lg: {
            'width': '1170px',
            'fields': '30px'
        },
        md: {
            'width': '970px',
            'fields': '15px'
        },
        sm: {
            'width': '750px',
            'fields': '15px'
        },
        xs: {
            'width': '550px',
            'fields': '15px'
        }
    }
};

var htmlbeautifySettings = {
    "indent_size": 4,
    "indent_char": " ",
    "eol": "\n",
    "indent_level": 0,
    "indent_with_tabs": false,
    "preserve_newlines": true,
    "max_preserve_newlines": 10,
    "jslint_happy": false,
    "space_after_anon_function": false,
    "brace_style": "collapse",
    "keep_array_indentation": false,
    "keep_function_indentation": false,
    "space_before_conditional": true,
    "break_chained_methods": false,
    "eval_code": false,
    "unescape_strings": false,
    "wrap_line_length": 0,
    "wrap_attributes": "auto",
    "wrap_attributes_indent_size": 4,
    "end_with_newline": false
};

gulp.task('html', function() {
    return gulp.src([
            'app/templates/**/*.html',
            '!app/templates/**/_*.html'
        ])
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlbeautify(htmlbeautifySettings))
        .pipe(gulp.dest('app/'));
});

gulp.task('njk', function() {
    return gulp.src([
            'app/templates/**/*.njk',
            '!app/templates/**/_*.njk'
        ])
        .pipe(plumber())
        .pipe(nunjucksRender({
            path: 'app/templates'
        }))
        .pipe(htmlbeautify(htmlbeautifySettings))
        .pipe(gulp.dest('app/'));
});

gulp.task('pug', function() {
    return gulp.src([
            'app/templates/**/*.pug',
            '!app/templates/**/_*.pug'
        ])
        .pipe(plumber())
        .pipe(pug())
        .pipe(htmlbeautify(htmlbeautifySettings))
        .pipe(gulp.dest('app/'));
});

gulp.task('smartgrid', function() {
    smartgrid('app/sass', smartgridSettings);
});

gulp.task('sass', function() {
    return gulp.src([
            'app/sass/**/*.sass',
            'app/sass/**/*.scss'
        ])
        .pipe(plumber())
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gcmq())
        .pipe(gulp.dest('app/css'));
});

gulp.task('css', ['sass'], function() {
    return gulp.src([
            'app/css/**/*.css',
            '!app/css/**/*.min.css'
        ])
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(cleanCSS())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('js-libs', function() {
    return gulp.src([
            'app/libs/jquery/dist/jquery.min.js',
            'app/libs/wow/dist/wow.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('js', ['js-libs'], function() {
    return gulp.src([
            'app/js/app.js'
        ])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app',
            directory: true
        },
        notify: false
    });
});

gulp.task('watch', [templatesType, 'smartgrid', 'css', 'js', 'browser-sync'], function() {
    switch (templatesType) {
        case 'html':
            gulp.watch(['app/templates/**/*.html', 'app/templates/**/*.htm'], ['html']);
            break;
        case 'pug':
            gulp.watch(['app/templates/**/*.pug'], ['pug']);
            break;
        case 'njk':
            gulp.watch(['app/templates/**/*.njk'], ['njk']);
            break;
    }

    gulp.watch(['app/sass/**/*.sass', 'app/sass/**/*.scss'], ['css']);
    gulp.watch(['libs/**/*.js', 'app/js/app.js'], ['js']);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('build', ['removedist', templatesType, 'smartgrid', 'css', 'js'], function() {

    var buildFiles = gulp.src([
            'app/**/*.html',
            '!app/templates/**/*.html',
            '!app/libs/**/*.html',
            'app/.htaccess'
        ]).pipe(gulp.dest('dist'));

    var buildCss = gulp.src([
            'app/css/**/*.min.css'
        ]).pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src([
            'app/js/libs.min.js',
            'app/js/app.min.js'
        ]).pipe(gulp.dest('dist/js'));

    var buildFonts = gulp.src([
            'app/fonts/**/*'
        ]).pipe(gulp.dest('dist/fonts'));

    var buildImages = gulp.src([
            'app/img/**/*'
        ])
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'));

});

gulp.task('deploy', function() {
    switch (deployMethod) {
        case 'rsync':
            return gulp.src('dist/**/*')
                .pipe(rsync(rsyncSettings));
            break;
        case 'sftp':
            return gulp.src('dist/**/*')
                .pipe(sftp(sftpSettings));
            break;
    }
});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
