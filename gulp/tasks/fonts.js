import gulp from 'gulp'
import browserSync from 'browser-sync'
import config from '../config'

const taskFonts = () => {
  return gulp.src(`${config.src.fonts}/**/*`)
    .pipe(gulp.dest(config.build.fonts))
}

gulp.task('fonts', () => {
  return taskFonts()
})

gulp.task('fonts:watch', ['fonts'], browserSync.reload)
