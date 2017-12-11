import util from 'gulp-util'
import webpack from 'webpack'
import merge from 'webpack-merge'

const webpackConfig = {
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'es2015', 'stage-0']
          },
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify(util.env.env || 'dev')
    })
  ]
}

export default {
  env: util.env.env || 'dev',

  envs: {
    dev: {
      css: {
        compressed: false
      },
      sass: {},
      webpack: merge(webpackConfig, {
        devtool: 'eval-source-map'
      })
    },

    prod: {
      css: {
        compressed: true
      },
      sass: {},
      webpack: merge(webpackConfig, {
        devtool: '#source-map',
        plugins: [
          new webpack.optimize.UglifyJsPlugin({ minimize: true })
        ]
      })
    }
  },

  src: {
    root: 'src',
    templates: 'src/templates',
    templatesExt: '.html',
    sass: 'src/sass',
    sassExt: '.sass',
    js: 'src/js',
    jsExt: '.js',
    img: 'src/img',
    fonts: 'src/fonts'
  },

  build: {
    root: 'dist',
    templates: 'dist',
    css: 'dist/css',
    js: 'dist/js',
    img: 'dist/img',
    fonts: 'dist/fonts'
  },

  smartgrid: {
    pathToSave: 'src/sass',
    options: {
      outputStyle: 'sass',
      filename: '_smart-grid',
      columns: 12,
      offset: '30px',
      container: {
        maxWidth: '1140px',
        fields: '30px'
      }
    }
  },

  autoprefixer: {
    browsers: ['last 2 versions', '> 10%', 'ie 11', 'ie 9']
  },

  htmlbeautify: {
    "indent_size": 2,
    "indent_char": " ",
    "eol": "\n",
    "indent_level": 0,
    "indent_with_tabs": false,
    "preserve_newlines": true,
    "max_preserve_newlines": 10,
    "jslint_happy": false,
    "space_after_anon_function": false,
    "brace_style": "collapse",
    "keep_array_indentation": false,
    "keep_function_indentation": false,
    "space_before_conditional": true,
    "break_chained_methods": false,
    "eval_code": false,
    "unescape_strings": false,
    "wrap_line_length": 0,
    "wrap_attributes": "auto",
    "wrap_attributes_indent_size": 4,
    "end_with_newline": false
  },

  server: {
    server: {
      baseDir: 'dist',
      directory: true
    },
    notify: false
  }
}
