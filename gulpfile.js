'use strict';

// init
var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch'),                // Наблюдение за изменениями файлов
    prefixer = require('gulp-autoprefixer'),         // Автоматически добавляет вендорные префиксы к CSS свойствам
    //rigger      = require('gulp-rigger'),               // Позволяет импортировать один файл в другой простой конструкцией
    sass = require('gulp-sass'),                 // для компиляции нашего SCSS кода
    sourcemaps = require('gulp-sourcemaps'),           // Для генерации css sourscemaps, помогает нам при отладке кода
    cssmin = require('gulp-minify-css'),           // Сжатие CSS кода
    plumber = require('gulp-plumber'),              // Ловим ошибки, чтобы не прервался watch
    browserSync = require('browser-sync'),     // Синхронизация с браузером
    through2 = require('through2').obj;     // Синхронизация с браузером
//reload = browserSync.reload;


const fs = require("fs");


// write rospritesmithuts
var path = {
    build: {
        // styles:        'local/templates/luster/'
        styles: 'src/'
    },
    src: {
        // styles:            'src/styles/*.*'
        styles: 'src/*.*'
    },
    watch: {
        styles: 'src/**/*.scss'
        //styles: 'src/*.sass',
    }
};

// styles
gulp.task('styles:build', function () {
    gulp.src(path.src.styles)               // Выберем наш main.scss
        .pipe(through2(function (file, enc, callback) {
            addNewClass(file);
            callback(null, file)
        }))
        .pipe(plumber())
        // .pipe(through2(function (file, enc, callback) {
        //     writeFile(file);
        //     callback(null, file);
        // }))
        .pipe(sourcemaps.init())            // То же самое что и с js
        .pipe(sass())                       // Скомпилируем
        .pipe(prefixer())                   // Добавим вендорные префиксы
        // .pipe(cssmin())                     // Сожмем
        // .pipe(sourcemaps.write())           // Пропишем карты
        // .pipe(plumber.stop())
        .pipe(gulp.dest(path.build.styles)) // И в build
        .pipe(browserSync.reload({stream: true}))
});


// styles
gulp.task('browser', function () {
    gulp.src("*.html")               // Выберем наш main.scss
        .pipe(plumber())
        .pipe(through2(function (file, enc, callback) {
            addNewClass(file);
            callback(null, file)
        }))
        .pipe(browserSync.reload({stream: true}))
});


gulp.task('build', [
    'styles:build'
]);

gulp.task('watch', function () {
    gulp.watch(path.watch.styles, ['styles:build'])
    gulp.watch('*.html', ['browser'])
});

gulp.task('browser-sync', function () {
    browserSync({

        server: {
            baseDir: "./"
        }

    });
});

gulp.task('default', ['build', 'watch', 'browser-sync']);
gulp.task('default-browser-sync', ['build', 'watch', 'browser-sync']);


//============================================================================
//============================================================================
//============================================================================
//============================================================================

let aliasClass = {
    'db': 'display: block',
    'df': 'display: flex',
    'dfi': 'display: flex-inline',
    'aic': 'align-items: center',
    'h': 'height',
    'w': 'width',
    'm': 'margin',
    'mb': 'margin-bottom',
    'p': 'padding',
    'pb': 'padding-bottom',
    'fz': 'font-size',
    'lh': 'line-height',
    'tc': 'text-align: center'
}



function addNewClass() {
    
    let textFile = fs.readFileSync("index.html", "utf8");

    const srhEl = '@';

    const re = /data-css=("|').*@.*("|')/ig;

    let found = textFile.match(re);

    let massClass = [];

    for (const key in found) {
        found[key] = found[key].replace(/data-css/, '');
        found[key] = found[key].replace(/=/, '');
        found[key] = found[key].replace(/"/g, '');
        found[key] = found[key].replace(/'/g, '');

        if (found[key].match(/\s/g)) {

            let masClassInObj = found[key].split(" ");

            for (const item of masClassInObj) {
                massClass.push(item);
            }
        } else {
            massClass.push(found[key]);
        }
    }

    //====  DELETE DUOBLICATE
    const regSpeshSimv = /.*@.*/;

    massClass = massClass.sort().reduce(function (arr, el) {
        if (!arr.length || arr.length && arr[arr.length - 1] != el) {

            if (el.match(regSpeshSimv)) {
                arr.push(el);
            }
        }
        return arr;
    }, []);

    console.log("match-delete-doubl", massClass);


    //====
    const regBegClass = /([A-Za-z]*)[\d]*[^\d-!]*[!]?[@]{1}/;

    const regDataClass = /([\d]*)[^\d]*@+/i;
    const regDataEd = /[\d]*([^\d-!]*)[!]?@/;
    const regImpot = /([!]?)@+/;

    const regSizeClass = /@+(.*)/;
    const regSizeMaxClass = /@+(\d*)/;
    const regSizeMinClass = /@+[\d]*[-]{1}(\d*)/;


    let nameClasses = [];


    for (const key in massClass) {

        let dataClass = {
            nameClass: '',
            nameProp: '',
            znProp: '',
            edProp: '',
            importProp: '',
            maxSize: '',
            minSize: ''
        }

        //=====
        if (massClass[key].match(regImpot)[1]) {
            dataClass.importProp = ' !important';
        }

        //=====
        let nameClass = massClass[key].replace(/\@/, '\\@');
        nameClass = nameClass.replace(/\!/, '\\!');
        nameClass = nameClass.replace(/\%/, '\\%');
        dataClass.nameClass = nameClass;

        let nameProp = massClass[key].match(regBegClass)[1];
        if (nameProp) {

            for (const item in aliasClass) {
                if (dataClass.importProp && nameProp.match(/.*[!]?/)) {
                    if (nameProp.match(/(.*)[!]/)) nameProp = nameProp.match(/(.*)[!]/)[1];
                }

                if (item == nameProp) {
                    dataClass.nameProp = aliasClass[item];
                }

            }
        }


        let root7888 = massClass[key].match(regDataClass)[1];
        dataClass.znProp = root7888;


        root7888 = massClass[key].match(regDataEd);

        if (root7888) {
            if (root7888[1]) {
                if (root7888[1] == 'n') {
                    dataClass.edProp = '';
                } else {
	                dataClass.edProp = root7888[1];
                }
            } else {
                dataClass.edProp = 'px';
            }
        }


        //----
        if (massClass[key].match(regSizeClass)) {

            const limitSizeCssMax = massClass[key].match(regSizeMaxClass);
            if (limitSizeCssMax && limitSizeCssMax[1]) dataClass.maxSize = limitSizeCssMax[1];

            const limitSizeCssMin = massClass[key].match(regSizeMinClass);
            if (limitSizeCssMin && limitSizeCssMin[1]) dataClass.minSize = limitSizeCssMin[1];
        }

        //======
        nameClasses.push(dataClass);
    }


    //=============
    let strAllCssProp = '';

    for (const item of nameClasses) {

        let strPorpClass = '';

        if (item.znProp) {
            strPorpClass = `${item.nameProp}: ${item.znProp}${item.edProp}${item.importProp};`;
        } else {
            strPorpClass = `${item.nameProp}${item.importProp};`;
        }

        strPorpClass = `[data-css~=${item.nameClass}] {
        	${strPorpClass}
        }`;


        let strWidthLimit = '';

        if (item.maxSize && item.minSize) {

            strWidthLimit = `@media (max-width: ${item.maxSize}px) and (min-width: ${item.minSize}px) {
				${strPorpClass}
			}`;

        } else {

            if (item.maxSize) {
                strWidthLimit = `@media (max-width: ${item.maxSize}px) {
					${strPorpClass}
				}`;
            }

            if (item.minSize) {
                strWidthLimit = `@media (min-width: ${item.minSize}px) {
					${strPorpClass}
				}`;
            }
        }


        if (!item.maxSize && !item.minSize) {
            strWidthLimit = strPorpClass;
        }

        strAllCssProp += strWidthLimit;
    }


    strAllCssProp = `.css-rule {
        ${strAllCssProp}
    }`;


    //=======
    //=======
    fs.writeFile('src/_special.scss', strAllCssProp, function (error) {

        if (error) throw error; // если возникла ошибка
    });
}

