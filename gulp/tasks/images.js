import gulp from 'gulp'
import imagemin from 'gulp-imagemin'
import browserSync from 'browser-sync'
import config from '../config'

const taskImages = () => {
  return gulp.src(`${config.src.img}/**/*`)
    .pipe(imagemin())
    .pipe(gulp.dest(config.build.img))
}

gulp.task('images', () => {
  return taskImages()
})

gulp.task('images:watch', ['images'], browserSync.reload)
