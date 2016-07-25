'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    typescript = require('gulp-tsc'),
    es6Promise = require('es6-promise'),
    reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        audio: 'build/audio/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html',
        ts: 'src/ts/main.ts',
        scss: 'src/scss/main.scss',
        img: 'src/img/**/*.*',
        audio: 'src/audio/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        ts: 'src/ts/**/*.ts',
        scss: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        audio: 'src/audio/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

es6Promise.polyfill();
gulp.task('ts:build', function () {
    gulp.src(path.src.ts) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init())
        .pipe(typescript({ out: 'main.js', emitError:false}))
        //.pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}
gulp.task('scss:build', function () {
    gulp.src(path.src.scss) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass().on('error', sass.logError)) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        //.pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('audio:build', function () {
    gulp.src(path.src.audio) //Выберем audio
        .pipe(gulp.dest(path.build.audio)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    'ts:build',
    'scss:build',
    'image:build',
    'audio:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.scss], function(event, cb) {
        gulp.start('scss:build');
    });
    watch([path.watch.ts], function(event, cb) {
        gulp.start('ts:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.audio], function(event, cb) {
        gulp.start('audio:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);