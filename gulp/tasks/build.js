import gulp from 'gulp'
import chalk from 'chalk'

gulp.task('build', ['clear', 'smartgrid', 'sass', 'webpack', 'templates', 'images', 'fonts'], () => {
  console.log('\n')
  console.log(chalk.green('>>>'), chalk.blue('Build completed!'))
  return gulp
})
