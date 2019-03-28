const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const fsPromises = require('fs').promises

const srcFiles = ['./src/**/*.js']

gulp.task('clean', () => {
  return fsPromises.readdir('dist')
    .then(fileList => {
      if (fileList.length > 0) {
        let unlinkPromises = []
        fileList.forEach(fileName => {
          unlinkPromises.push(fsPromises.unlink(`dist/${fileName}`))
        })
        return Promise.all(unlinkPromises)
      }
    }).catch(error => {
      if (error.code !== 'ENOENT') { return Promise.reject(error) }
    })
})

gulp.task('build', () =>
  gulp.src(srcFiles)
    .pipe(babel({
      presets: ['@babel/env']
    }))
  .pipe(gulp.dest('dist'))
)

gulp.task('lint', () => {
  return gulp.src(srcFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('server', () => {
  browserSync.init({
    port: 8080,
    notify: false,
    reloadOnRestart: true,
    https: false,
    server: ['./']
  })

  gulp.watch([
    '**/*.html',
    '**/*.js'
  ]).on('change', browserSync.reload)
})

gulp.task('development', gulp.series(
  gulp.parallel('build'),
  async function watch () {
    gulp.watch(srcFiles, gulp.parallel('build'))
  },
  async function testServer () {
    browserSync.init({
      port: 8080,
      notify: false,
      reloadOnRestart: true,
      https: false,
      server: ['./'],
      startPath: 'playground/test.html'
    })
    gulp.watch([
      'dist/*',
      'plaground/*'
    ]).on('change', browserSync.reload)
  }
))

gulp.task('docs', gulp.series('build', function copyToDocs () {
  return gulp.src('dist/kairoi.js')
    .pipe(gulp.dest('docs/javascripts'))
}))
