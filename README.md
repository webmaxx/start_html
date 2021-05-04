Start HTML Template
===================

Startup template for layout

![AppVeyor](https://img.shields.io/appveyor/build/webmaxx/start-html?style=flat-square)
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/webmaxx/start_html?style=flat-square)
![GitHub language count](https://img.shields.io/github/languages/count/webmaxx/start_html?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/webmaxx/start_html?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/webmaxx/start_html?style=flat-square)

## Used

* [Gulp][gulp]
* [Webpack][webpack]
* [Babel][babel]
* [Pug][pug]
* [Nunjucks][nunjucks]
* [Less][less]
* [Sass][sass]
* [TypeScript][typescript]
* [Smart Grid][smart-grid]
* [BrowserSync][browser-sync]
* [PostCSS][postcss]

## Install

1. Run command: `"git clone https://github.com/webmaxx/start_html"` (or [download](https://github.com/webmaxx/start_html/archive/master.zip) and unpack archive)
2. In folder with template install **Node** modules run command: `"yarn"` or `"npm i"`

## Settings

In file `"gulpfile.js"` to section `"Config"` you can set the settings for the templates and styles used.

## Commands

- Run project in dev-mode: `"yarn watch"` or `"npm run watch"`
- Build project: `"yarn build"` or `"npm run build"`

## Structure folders

- `"app"` - project source folder
- `"build"` - folder with the assembled project (appears after executing the command to build)
- `"dist"` - folder with the assembled project in development mode
- `"app-examples"` - folder with examples for templates and styles

[gulp]: http://gulpjs.com/
[webpack]: https://webpack.js.org/
[babel]: http://babeljs.io/
[pug]: https://pugjs.org/
[nunjucks]: http://mozilla.github.io/nunjucks/
[less]: http://lesscss.org/
[sass]: http://sass-lang.com/
[typescript]: http://www.typescriptlang.org/
[smart-grid]: https://github.com/dmitry-lavrik/smart-grid
[browser-sync]: https://www.browsersync.io/
[postcss]: https://postcss.org/
