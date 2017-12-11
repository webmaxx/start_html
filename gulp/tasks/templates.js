import gulp from 'gulp'
import plumber from 'gulp-plumber'
import render from 'gulp-nunjucks-render'
import htmlbeautify from 'gulp-html-beautify'
import browserSync from 'browser-sync'
import config from '../config'

const taskTemplates = () => {
  return gulp.src([
    `${config.src.templates}/**/*${config.src.templatesExt}`,
    `!${config.src.templates}/**/_*${config.src.templatesExt}`
  ])
    .pipe(plumber())
    .pipe(render({
      path: config.src.templates,
      data: {
        ENV: config.env
      }
    }))
    .pipe(htmlbeautify(config.htmlbeautify))
    .pipe(gulp.dest(config.build.templates))
}

gulp.task('templates', () => {
  return taskTemplates()
})

gulp.task('templates:watch', ['templates'], browserSync.reload)
