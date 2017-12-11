import gulp from 'gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import gcmq from 'gulp-group-css-media-queries'
import cleanCss from 'gulp-clean-css'
import sourcemaps from 'gulp-sourcemaps'
import browserSync from 'browser-sync'
import config from '../config'

const taskSass = () => {
  let task = gulp.src(`${config.src.sass}/**/*${config.src.sassExt}`)
    .pipe(sourcemaps.init())
    .pipe(sass(config.envs[config.env].sass).on('error', sass.logError))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gcmq())

  if (config.envs[config.env].css.compressed) {
    task.pipe(cleanCss())
  }

  task.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.build.css))

  return task
}

gulp.task('sass', () => {
  return taskSass()
})

gulp.task('sass:watch', () => {
  let task = taskSass()

  task.pipe(browserSync.reload({
    stream: true
  }))

  return task
})
