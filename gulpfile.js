const fs = require('fs');
const del = require('del');
const path = require('path');
const gulp = require('gulp');
const JSZip = require('jszip');
const copy = require('gulp-copy');
const through = require('through2');
const webpack = require('webpack');
const VinylFile = require('vinyl');
const rs = require('replacestream');
const eslint = require('gulp-eslint');
const concatStream = require('concat-stream');
const runSequence = require('run-sequence').use(gulp);


const zip = new JSZip();

gulp.task('clean', () => del(['dist']));

gulp.task('webpack', (cb) => {
    webpack(require('./webpack.config.js'), cb);
});

gulp.task('lint', () => {
  return gulp.src([
      '**/*.js',
      '!gulpfile.js',
      '!dist',
      '!node_modules/**',
      '!js/TweenMax.min.js',
      '!js/modernizr-custom.js',
    ])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

gulp.task('copy', () => {
  return gulp.src([
      'src/**/*',
      '!src/js/*',
      '!src/styles/*',
      '!src/build.js',
      '!src/template.html',
  ])
  .pipe(copy('dist', {
      prefix: 1
  }))
})

gulp.task('serviceworker', () => {
  return gulp.src([
      'src/js/sw.js',
  ])
  .pipe(copy('dist', {
      prefix: 2
  }))
})

gulp.task('default', (cb) => {
    return runSequence(
        'clean',
        'lint',
        'webpack',
        ['copy', 'serviceworker'],
        'hta'
    )
}
);

const createHTA = (opts = {}) => {

    opts = Object.assign(opts, {dir: 'Hush Lil Baby', zipName: 'HushLilBaby.zip'});

    // in order to have a desktop.ini image show up, the containing directory has
    // to have the system permission set. Since we can't control the unzipped dir's
    // permissions, we wrap everything up in a directory that we set the correct
    // system permisssion flag on
    const folder = zip.folder(opts.dir);
    let firstFile;


    folder.files[folder.root].dosPermissions = 20;

    const stream = through.obj((file, encoding, cb) => {

      // a whole lot of the files will never be loaded in oldIE, as a result, there isn't any reason to zip em up
      const matchesIgnoreRegex =  file.path.match(/(\/icons|appcache|sw.js$|browserconfig.xml|manifest.json|\.ogg$|\.zip$)/);

      if (matchesIgnoreRegex || file.stat.isDirectory()) {
        return cb();
      }

      if (!firstFile) {
        firstFile = file;
      }

      if (file.path.match(/index\.html$/)) {
       // Keepings the HTA code in the actual html document would be really dumb,
       // since no one is actually ever going to really use this. So we just replace()
       // it in here, along with a check to see if the hta file has been moved out
       // of its folder that contains all of its hidden assets required for it to work

        file._contents = new Buffer(String(file._contents)
          .replace('\<head\>', (h) => h + `<HTA:APPLICATION border="thin" borderStyle="normal" icon="./favicon.ico" maximizeButton="yes" minimizeButton="yes" showInTaskbar="no" innerBorder="yes" navigable="yes" scroll="none"/><script language="VBScript">
        sub Window_onLoad()
          set oFSO=CreateObject("Scripting.FileSystemObject")
            If (oFSO.FileExists("favicon.ico")) Then
              document.all.ScriptArea.value="GOOD TO GO"
            Else
              document.all.ScriptArea.value="SHITS BEEN MOVED"
            End If
        end sub
      </script>`)
        )

        file.path = file.path.replace('index\.html', 'index\.hta');
      }

      folder.file(file.relative, file._contents, {dosPermissions: 34});

      cb();
    }, (cb) => {

      if (!firstFile) {
        return cb();
      }

      // Add some HTA specific files
      folder.file('desktop.ini', '[.ShellClassInfo]\r\nIconFile=favicon.ico\r\nIconIndex=0', {dosPermissions: 38});

      zip.generateNodeStream({type:'nodebuffer',streamFiles:true}).pipe(concatStream((data) => {
        stream.push(new VinylFile({
          cwd: firstFile.cwd,
          base: firstFile.base,
          path: path.join(firstFile.base, opts.zipName),
          contents: data
        }));

        cb();
      }));
    })

  return stream;
}

gulp.task('hta', () => {
  gulp.src(['dist/**/*'])
    .pipe(createHTA())
    .pipe(gulp.dest('dist'))
});
