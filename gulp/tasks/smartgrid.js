import gulp from 'gulp'
import smartgrid from 'smart-grid'
import config from '../config'

gulp.task('smartgrid', () => {
    smartgrid(config.smartgrid.pathToSave, config.smartgrid.options)
})
