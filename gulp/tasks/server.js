import gulp from 'gulp'
import browserSync from 'browser-sync'
import config from '../config'

gulp.task('server', () => {
  browserSync(config.server)
  return gulp
})
