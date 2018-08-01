const gulp = require('gulp'),
      sass = require('gulp-sass'),
      browserSync = require('browser-sync'),
      concat = require('gulp-concat'),
      uglifyJS  = require('gulp-uglifyjs'),
      uglify  = require('gulp-uglify'),
      cssnano = require('gulp-cssnano'),
      rename = require('gulp-rename'),
      del = require('del'),
      autoprefixer = require('gulp-autoprefixer'),
      webpack = require('webpack'),
      webpackStream = require('webpack-stream');  

gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/scss/**/*.scss') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('lib', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglifyJS()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('scripts', function () {
  return gulp.src('./app/js/dataCollector.js')
    .pipe(webpackStream({
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ['env']
            }
          }
        ]
      },
      externals: {
        jquery: 'jQuery'
      }
    }))
    .pipe(gulp.dest('./app/js'));
});

gulp.task('css-libs', function() {
    return gulp.src(['app/css/main.css', 'app/css/reset.css']) 
      .pipe(rename({suffix: '.min'}))
      .pipe(cssnano()) // Сжимаем
      .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('watch', gulp.parallel('browser-sync', 'sass', 'css-libs', 'scripts'), function() {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', gulp.series('scripts'), browserSync.reload);
});

gulp.task('clean', function(done) {
    del(['dist']).then(paths => {
    });
    done();
});

gulp.task('build', gulp.series('clean', 'sass', 'css-libs', 'scripts', function(done) {
    let buildCss = gulp.src([ // Переносим CSS стили в продакшен
        'app/css/*.min.css',
        ])
    .pipe(gulp.dest('dist/css'))
    
    let buildJs = gulp.src('app/js/main.js')
    .pipe(gulp.dest('dist/js'))
    
    let buildImg = gulp.src('app/img/*.*')
    .pipe(gulp.dest('dist/img'))
    
    let buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
    done();
}));

gulp.task('build-debug', gulp.series('clean', 'sass', 'css-libs', function(done) {
    let buildCss = gulp.src([ // Переносим CSS стили в продакшен
        'app/css/*.min.css',
    ]);
    
    let buildJs = gulp.src('app/js/canvasOnClasses.js')
      .pipe(gulp.dest('app/js'))
      .pipe(rename("main.js"))

    let buildHtml = gulp.src('app/*.html');
    done();
}));

gulp.task('default', gulp.series('watch', function(done) {
  // do more stuff
  done();
}))