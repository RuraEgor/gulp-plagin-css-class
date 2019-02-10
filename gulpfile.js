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

const aliasClassSourch = require('./js/alias');
const aliasClass = aliasClassSourch.zn;

const sizeValueSourch = require('./js/varSize');
const sizeValue = sizeValueSourch.zn;


function addNewClass() {

    let textFile = fs.readFileSync("index.html", "utf8");


    const regFirstSearch = /data-css=("|').*@*.*("|')/ig;

    let allMatch = textFile.match(regFirstSearch);

    let massClass = [];

    for (const key in allMatch) {
        allMatch[key] = allMatch[key].replace(/data-css/, '');
        allMatch[key] = allMatch[key].replace(/=/, '');
        allMatch[key] = allMatch[key].replace(/"/g, '');
        allMatch[key] = allMatch[key].replace(/'/g, '');

        if (allMatch[key].match(/\s/g)) {

            let masClassInObj = allMatch[key].split(" ");

            for (const item of masClassInObj) {
                massClass.push(item);
            }
        } else {
            massClass.push(allMatch[key]);
        }
    }



    // for (let keySize in massClass) {
    //     if (massClass[keySize].match(/[$]/)) {
    //
    //         for (const keySizeVar in sizeValue) {
    //
    //             const regex = new RegExp('[$]' + keySizeVar, 'g');
    //             if (massClass[keySize].match(regex)) {
    //                 massClass[keySize] = massClass[keySize].replace(regex, sizeValue[keySizeVar]);
    //             }
    //         }
    //     }
    // }


    //====  DELETE DUOBLICATE
    const regSpeshSimv = /.*@.*/;

    massClass = massClass.sort().reduce(function (arr, el) {
        if (!arr.length || arr.length && arr[arr.length - 1] != el) {

            arr.push(el);
        }
        return arr;
    }, []);

    // console.log("match-delete-doubl", massClass);


    //====
    const regBegClass = /^([A-Za-z]*)[\d]*[^\d-!]*[!]?[@]?/;

    const regDataClass = /^[A-Za-z]*([\d]*)[^\d]*@?/i;
    const regDataEd = /^[A-Za-z]*[\d]*([^\d-!-@]*)[!]?@?/;
    // const regImpot = /([!]?)@?/;
    const regImpot = /[!]{1}/;

    const regSizeClass = /@+(.*)/;
    const regSizeMaxClass = /@+([$]?[\w-\d]*)[>]?[$]?[\w-\d]*/i;
    const regSizeMinClass = /@+[$]?[\w-\d]*[<]{1}([$]?[\w-\d]*)/i;

    let nameClasses = [];

    for (const key in massClass) {

        let dataClass = {
            nameClass: '',
            nameProp: '',
            mediaOpt: []
        }


        //=====
        let nameClass = massClass[key].replace(/\@/g, '\\@');
        nameClass = nameClass.replace(/\!/g, '\\!');
        nameClass = nameClass.replace(/\%/g, '\\%');
        nameClass = nameClass.replace(/\>/g, '\\>');
        nameClass = nameClass.replace(/\</g, '\\<');
        nameClass = nameClass.replace(/\$/g, '\\$');
        dataClass.nameClass = nameClass;


        //=====
        const nameProp = massClass[key].match(regBegClass)[1];
        if (nameProp) {
            for (const item in aliasClass) {
                if (item == nameProp) {
                    dataClass.nameProp = aliasClass[item];
                }
            }
        }


        //=====
        let masParMedia = massClass[key].split('-');

        for (let itemMedia of masParMedia) {

            let mediaParamClass = {
                znProp: '',
                edProp: '',
                importProp: '',
                maxSize: '',
                minSize: ''
            }


            //=====
            if (itemMedia.match(regImpot)) {
                mediaParamClass.importProp = ' !important';
            }


            //=====
            if (itemMedia.match(regDataClass)[1]) {
                mediaParamClass.znProp = itemMedia.match(regDataClass)[1];
            }


            //=====
            const unitsRule = itemMedia.match(regDataEd)[1];

            if (unitsRule) {
                if (unitsRule == 'n') {
                    mediaParamClass.edProp = '';
                } else {
                    mediaParamClass.edProp = unitsRule;
                }
            } else {
                mediaParamClass.edProp = 'px';
            }


            //=====
            if (itemMedia.match(regSizeClass)) {

                const limitSizeCssMax = itemMedia.match(regSizeMaxClass);
                if (limitSizeCssMax && limitSizeCssMax[1]) {

                        if (limitSizeCssMax[1].match(/[$]/)) {
                            for (const keySizeVar in sizeValue) {
                                const regex = new RegExp('[$]' + keySizeVar, 'g');
                                if (limitSizeCssMax[1].match(regex)) {
                                    mediaParamClass.maxSize = limitSizeCssMax[1].replace(regex, sizeValue[keySizeVar]);
                                    break;
                                }
                            }
                        } else {
                            mediaParamClass.maxSize = limitSizeCssMax[1];
                        }
                }


                const limitSizeCssMin = itemMedia.match(regSizeMinClass);
                if (limitSizeCssMin && limitSizeCssMin[1]) {


                    if (limitSizeCssMax[1].match(/[$]/)) {
                        for (const keySizeVar in sizeValue) {
                            const regex = new RegExp('[$]' + keySizeVar, 'g');
                            if (limitSizeCssMax[1].match(regex)) {
                                mediaParamClass.minSize = limitSizeCssMax[1].replace(regex, sizeValue[keySizeVar]);
                                break;
                            }
                        }
                    } else {
                        mediaParamClass.minSize = limitSizeCssMax[1];
                    }
                }
            }


            //======
            dataClass.mediaOpt.push(mediaParamClass);
        }

        nameClasses.push(dataClass);
    }


    //=============
    let strAllCssProp = '';
    for (const item of nameClasses) {

        //=====
        let nameClassSelect = `[data-css~=${item.nameClass}]`;

        //=====
        let strWidthLimit = '';
        let strWidthLimitAll = '';

        for (let sizeOpt of item.mediaOpt) {
            let strPorpClass = '';

            if (sizeOpt.znProp) {
                strPorpClass = `${item.nameProp}: ${sizeOpt.znProp}${sizeOpt.edProp}${sizeOpt.importProp};`;
            } else {
                strPorpClass = `${item.nameProp}${sizeOpt.importProp};`;
            }


            if (sizeOpt.maxSize && sizeOpt.minSize) {

                strWidthLimit = `@media (max-width: ${sizeOpt.maxSize}px) and (min-width: ${sizeOpt.minSize}px) {
				${strPorpClass}
			}`;

            } else {

                if (sizeOpt.maxSize) {
                    strWidthLimit = `@media (max-width: ${sizeOpt.maxSize}px) {
					${strPorpClass}
				}`;
                }

                if (sizeOpt.minSize) {
                    strWidthLimit = `@media (min-width: ${sizeOpt.minSize}px) {
					${strPorpClass}
				}`;
                }
            }


            if (!sizeOpt.maxSize && !sizeOpt.minSize) {
                strWidthLimit = strPorpClass;
            }

            strWidthLimitAll += strWidthLimit;
        }


        let fullRuleCssElem = `${nameClassSelect} {
                ${strWidthLimitAll}
            }`;

        strAllCssProp += fullRuleCssElem;
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

