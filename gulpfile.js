const gulp = require('gulp');

//css
const concatCss = require('gulp-concat-css');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

//image
const imagemin = require('gulp-imagemin');
const imageminJpg = require('imagemin-jpeg-recompress');
const imageminPng = require('imagemin-optipng');

//js
const terser = require('gulp-terser');

// clean
const clean = require('gulp-clean');

// browser-sync
var browserSync = require('browser-sync').create();

// browser-sync start --server --files "*.*"
// browser-sync start --proxy "myproject" --files "*.css, *.html, *.php, *.js"

const cssFile = [
    './src/css/fonts.css',
    './src/css/core.css',
    './src/css/info.css',
    './src/css/education.css',
    './src/css/project.css',
    './src/css/project_mobile.css',
    './src/css/fix.css',
    './src/css/media.css'
];

const jsFile = [
    './src/js/arrays.js',
    './src/js/show_description.js',
    './src/js/drop_panel.js',
    './src/js/drop_panel_mobile.js',
    './src/js/slider.js',
    './src/js/swipe.js'
];

gulp.task('html', function () {
    return gulp.src('./src/index.html')

    .pipe(gulp.dest('./build'))
})

gulp.task('fonts', function () {
    return gulp.src('./src/css/fonts/*.*')

    .pipe(gulp.dest('./build/css/fonts'))
})

gulp.task('styles', function () {
    return gulp.src(cssFile)

    .pipe(concatCss('style.css'))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cleanCSS({
        level: 2
    }))

    .pipe(gulp.dest('./build/css'))
})

gulp.task('images', function () {
    return gulp.src('src/img/*')

    .pipe(imagemin([
        imageminJpg({
            loops: 4,
            min: 50,
            max: 95,
            quality: 'high' 
        }),
        imageminPng({
            optimizationLevel: 5
        })
    ]))
    .pipe(gulp.dest('build/img'))
})

gulp.task('scripts', function () {
    return gulp.src(jsFile)

    .pipe(terser({
        keep_fnames: true,
        mangle: false,
        compress: true
    }))

    .pipe(gulp.dest('./build/js'));
})

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    browserSync.watch('build', browserSync.reload)
});


gulp.task('clean', function () {
    return gulp.src('build/js/*', {read: false})
        .pipe(clean())
});

gulp.task('watch', function() {
    gulp.watch('src/index.html', gulp.series('html'));
    gulp.watch('src/css/fonts/font.css', gulp.series('fonts'));
    gulp.watch('src/css/*.css', gulp.series('styles'));
    gulp.watch('src/js/*.js', gulp.series('scripts'));
});

gulp.task('default', gulp.series(
    gulp.parallel('html','fonts','styles','scripts'),
    gulp.parallel('watch','serve')
));