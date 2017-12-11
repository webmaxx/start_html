import gulp from 'gulp'
import named from 'vinyl-named'
import webpack from 'webpack'
import webpackGulp from 'gulp-webpack'
import browserSync from 'browser-sync'
import config from '../config'

const taskJS = () => {
  return gulp.src(`${config.src.js}/*${config.src.jsExt}`)
    .pipe(named())
    .pipe(webpackGulp(config.envs[config.env].webpack, webpack))
    .pipe(gulp.dest(config.build.js))
}

gulp.task('webpack', () => {
  return taskJS()
})

gulp.task('webpack:watch', ['webpack'], browserSync.reload)
