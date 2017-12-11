import gulp from 'gulp'
import chalk from 'chalk'
import config from '../config'

gulp.task('build', ['clear', 'webpack', 'smartgrid', 'sass', 'templates', 'images', 'fonts'], () => {
  console.log('\n')
  console.log(chalk.green('>>>'), chalk.blue('Build completed!'))
  return gulp
})
