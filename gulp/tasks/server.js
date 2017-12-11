import gulp from 'gulp'
import browserSync from 'browser-sync'
import config from '../config'

gulp.task('server', () => {
  browserSync(config.server)

  gulp.watch(`${config.src.js}/**/*${config.src.jsExt}`, ['webpack:watch'])
  gulp.watch(`${config.src.sass}/**/*.${config.src.sassExt}`, ['sass:watch'])
  gulp.watch(`${config.src.templates}/**/*${config.src.templatesExt}`, ['templates:watch'])
  gulp.watch(`${config.src.images}/**/*`, ['images:watch'])
  gulp.watch(`${config.src.fonts}/**/*`, ['fonts:watch'])

  return gulp
})
