Start HTML Template
===================

Стартовый шаблон для верстки

## Используемые технологии

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

## Установка

1. Выполнить команду: `"git clone https://github.com/webmaxx/start_html"` (либо [скачать](https://github.com/webmaxx/start_html/archive/master.zip) и распаковать шаблон)
2. В папке с шаблоном установить **Node** модули командой: `"yarn"` или `"npm i"`

## Настройка

В файле `"gulpfile.js"` в секции `"Config"` можно выставить настройки для используемых шаблонов и стилей.

## Команды

- Запуска проекта в режиме разработки: `"yarn watch"` или `"npm run watch"`
- Сборка проекта: `"yarn build"` или `"npm run build"`

## Структура

- `"app"` - папка исходным кодом проекта
- `"build"` - папка с собранным проектом (появляется после выполнения команды для сборки)
- `"dist"` - папка с собранным проектом в режиме разработки
- `"app-examples"` - папка с примерами для шаблонов и стилей

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
