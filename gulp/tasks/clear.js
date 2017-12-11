import gulp from 'gulp'
import del from 'del'
import config from '../config'

gulp.task('clear', () => {
  del.sync(config.build.root)
  return gulp
})
