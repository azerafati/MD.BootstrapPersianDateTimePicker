const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const path = require("path");
const del = require('del');
const header = require('gulp-header');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const package = require('./package.json');
const iife = require("gulp-iife");
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const minifyes = composer(uglifyes, console);
const fs = require('fs');
const replace = require('gulp-replace');
const babel = require('gulp-babel');


const distributionDir = 'dist/';


gulp.task('clean', function () {
    return del('./' + distributionDir + '**');
});

gulp.task('browser-sync', function (done) {

    browserSync.init({
        server: {
            baseDir: "./",
            index: '/demo/index.html',
        },
        ui: false,
        //browser: "chrome"
    });

    done();
});

gulp.task('javascript', function (done) {
    let sources = ['src/**/*.js'];

    return gulp.src(sources, {base: '.'})
        .pipe(sourcemaps.init())
        .pipe(concat(package.name + ".js"))
        .on('error', logError)
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/'}))
        .pipe(gulp.dest(distributionDir));
});

gulp.task('scss', function () {
    return gulp.src('src/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', logError)
        .pipe(concat(package.name + '.css'))
        .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/src/'}))
        .pipe(gulp.dest(distributionDir))
        .pipe(browserSync.stream());
});


function browserSyncReload(done) {
    browserSync.reload();
    done();
}


gulp.task('watch', gulp.series(gulp.parallel('scss', 'javascript'), function watch(done) {
    gulp.watch(['src/**/*css'], gulp.parallel('scss'));
    gulp.watch(['src/**/*.js'], gulp.series('javascript', browserSyncReload));
    //gulp.watch(["assets/app/**/*.html", "app/**/*.php", "assets/admin/app/**/*.html"], gulp.parallel(browserSyncReload));

    done();
}));


gulp.task('default', gulp.series(gulp.parallel('clean'), 'watch', 'browser-sync'));


function logError(error) {

    // If you want details of the error in the console
    console.log(error.toString());
    this.emit('end');
}


gulp.task('minify-js', gulp.series('javascript', function minify(done) {

    return gulp.src([package.name + ".js"], {base: distributionDir, cwd: distributionDir})
        .pipe(iife({
            useStrict: false
        }))
        .pipe(minifyes().on('error', function (e) {
            console.log(e);
            //callback(e);
        }))
        .pipe(header(fs.readFileSync('header.txt', 'utf8'), {pkg: package}))
        .pipe(gulp.dest(distributionDir));
}));


gulp.task('styles-minify', gulp.series(gulp.parallel('scss'), function () {
    return gulp.src([package.name + ".css"], {base: distributionDir, cwd: distributionDir})
        .pipe(cleanCSS({
            level: {
                2: {
                    specialComments: 'none',
                    normalizeUrls: false
                }
            },
            //inline: ['local'],
            rebase: false
        }))
        //.pipe(sourcemaps.write())
        .pipe(header(fs.readFileSync('header.txt', 'utf8'), {pkg: package}))
        .pipe(gulp.dest(distributionDir));
}));


gulp.task('php-minify', function () {
    return gulp.src(['app/view/fragments/base.php'], {base: distributionDir, cwd: distributionDir})
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            sortAttributes: true,
            sortClassName: true,
            ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?(\?>|$)/],
            trimCustomFragments: true
        }))
        .pipe(gulp.dest(distributionDir));
});


gulp.task('distribute', gulp.series('clean',
    gulp.parallel('styles-minify', 'minify-js')
    //gulp.parallel('php-minify', 'php-minify-admin'),
    //'production-replace'
    )
);

