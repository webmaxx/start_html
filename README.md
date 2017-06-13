Start HTML Template
===================

Стартовый шаблон для верстки

## Используемые технологии

* [Gulp][gulp]
* [Bower][bower]
* [Nunjucks][nunjucks]
* [Pug][pug]
* [Sass][sass]
* [Smart Grid][smart-grid]

## Используемые библиотеки

* [gulp][gulp]
* [gulp-util][gulp-util]
* [gulp-plumber][gulp-plumber]
* [gulp-concat][gulp-concat]
* [gulp-pug][gulp-pug]
* [gulp-nunjucks-render][gulp-nunjucks-render]
* [gulp-file-include][gulp-file-include]
* [gulp-html-beautify][gulp-html-beautify]
* [gulp-sass][gulp-sass]
* [gulp-autoprefixer][gulp-autoprefixer]
* [gulp-group-css-media-queries][gulp-group-css-media-queries]
* [gulp-clean-css][gulp-clean-css]
* [gulp-uglify][gulp-uglify]
* [gulp-rename][gulp-rename]
* [gulp-cache][gulp-cache]
* [gulp-notify][gulp-notify]
* [gulp-rsync][gulp-rsync]
* [gulp-sftp][gulp-sftp]
* [gulp-imagemin][gulp-imagemin]
* [imagemin-pngquant][imagemin-pngquant]
* [del][del]
* [smart-grid][smart-grid]
* [browser-sync][browser-sync]

## Установка

1. [Скачать](https://github.com/webmaxx/start_html/archive/master.zip) шаблон
2. Установить **Node** модули: `npm i`
3. Запустить шаблон: `gulp`

## Структура

* `app` - рабочая директория
* `app/css` - создается автоматически. Тут не надо ничего трогать
* `app/fonts` - папка со шрифтами. Можно добавлять свои и подключать в файле `app/sass/_fonts.sass`
* `app/img` - папка с изображениями
* `app/js` - **javascript** файлы. Можно добавлять свои
* `app/libs` - сторонние библиотеки
* `app/sass` - **[sass][sass]**-файлы. Можно использовать **SCSS** синтаксис
* `app/templates` - шаблоны страниц
* `dist` - создается автоматически. Скомпилированная и оптимизированная версия проекта. Тут ничего не надо редактировать
* `node_modules` - папка с модулями для **Node**. Создается автоматически после команды `npm i`
* `.bowerrc` - файл настроек для **bower**
* `.gitignore` - убираем некоторые папки/файлы, которым не место в **git**-е
* `README.md` - тот файл, содержимое которого сейчас перед глазами
* `gulpfile.js` - файл с задачами для **[Gulp][gulp]**
* `package.json` - файл со списком модулей для **Node**

## Gulp-задачи

* `html` - компилирование html-шаблонов
* `njk` - компилирование [nunjucks][nunjucks]-шаблонов
* `pug` - компилирование [pug][pug]-шаблонов
* `smartgrid` - генерация **[Smart Grid][smart-grid]** сетки
* `sass` - компилирование **[sass][sass]** и **scss** файлов
* `css` - минимизация css-файлов после выполнения задчи **sass**
* `js-libs` - сборка сторонних js-библиотек в один сжатый файл
* `js` - сборка своих js-файлов в один сжатый файл
* `browser-sync` - запуск сервера
* `watch` - отслеживание изменения в файлах
* `build` - сборка проекта
* `deploy` - загрузка собранного проекта на удаленный сервер
* `removedist` - удаление папки **dist**
* `clearcache` - очистка кеша. Используется при оптимизации изображений
* `default` - задача по умолчанию (используется **watch**)

## Правила работы с шаблоном

* Все шаблоны должны находиться в папке `app/templates`.
* Есть возможность использовать как простые **html**-шаблоны, так и шаблоны в формате **[pug][pug]**.
* Шаблоны компилируются и складываются в корень папки **app**. Трогать их не надо.
* Для удобства, с html-шаблонами работает плагин **[gulp-file-include][gulp-file-include]**, позволяющий использовать конструкции вида `@@include('_template_name.html')`. Подробнее можно почитать [тут][gulp-file-include].
* Шаблоны с расширением `*.njk` ([Nunjucks][nunjucks]) обрабатываются плагином **[gulp-nunjucks-render][gulp-nunjucks-render]**. Подробнее можно почитать [тут][gulp-nunjucks-render]. 
* Есть возможность устанавливать дополнительные библиотеки через [Bower][bower] (например `bower i packageName`). Устанавливаются в папку `app/libs`.
* Все **css**-стили сторонних библиотек следует импортировать в файле `app/sass/_libs.sass`.
* Все **javascript**-файлы сторонних библиотек следует подключать в файле `gulpfile.js` в задаче `js-libs`.
* При создании своих **javascript**-файлов, их следует подключать в файле `gulpfile.js` в задаче `js`.
* Для загрузки проекта на удаленный сервер, можно выбрать метод загрузки (`[gulp-rsync][gulp-rsync]` или `[gulp-sftp][gulp-sftp]`), путем проставления нужного значения переменной `deployMethod`.
* Если используется SFTP загрузка проекта на сервер, то надо скопировать файл `.sftppass.example` в `.sftppass` и прописать в нем логин/пароль для SFTP.

[gulp]: http://gulpjs.com/
[bower]: https://bower.io/
[nunjucks]: http://mozilla.github.io/nunjucks/
[pug]: https://pugjs.org/
[sass]: http://sass-lang.com/
[smart-grid]: https://www.npmjs.com/package/smart-grid/
[gulp-plumber]: https://www.npmjs.com/package/gulp-plumber
[gulp-util]: https://www.npmjs.com/package/gulp-util
[gulp-concat]: https://www.npmjs.com/package/gulp-concat
[gulp-pug]: https://www.npmjs.com/package/gulp-pug
[gulp-nunjucks-render]: https://www.npmjs.com/package/gulp-nunjucks-render
[gulp-file-include]: https://www.npmjs.com/package/gulp-file-include
[gulp-html-beautify]: https://www.npmjs.com/package/gulp-html-beautify
[gulp-sass]: https://www.npmjs.com/package/gulp-sass
[gulp-autoprefixer]: https://www.npmjs.com/package/gulp-autoprefixer
[gulp-group-css-media-queries]: https://www.npmjs.com/package/gulp-group-css-media-queries
[gulp-clean-css]: https://www.npmjs.com/package/gulp-clean-css
[gulp-uglify]: https://www.npmjs.com/package/gulp-uglify
[gulp-rename]: https://www.npmjs.com/package/gulp-rename
[gulp-cache]: https://www.npmjs.com/package/gulp-cache
[gulp-notify]: https://www.npmjs.com/package/gulp-notify
[gulp-rsync]: https://www.npmjs.com/package/gulp-rsync
[gulp-sftp]: https://www.npmjs.com/package/gulp-sftp
[gulp-imagemin]: https://www.npmjs.com/package/gulp-imagemin
[imagemin-pngquant]: https://www.npmjs.com/package/imagemin-pngquant
[del]: https://www.npmjs.com/package/del
[browser-sync]: https://www.npmjs.com/package/browser-sync
