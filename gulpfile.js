const gulp = require('gulp');
const util = require('gulp-util');
const open = require('open');
const ngrok = require('ngrok');
const nodemon = require('gulp-nodemon');

gulp.task('run', () => {
  ngrok.connect(3000, (ngrokError, url) => {
    if (ngrokError) {
      throw ngrokError;
    }

    nodemon({
      script: './build/webpack/server.js',
      ext: 'js json',
      env: {
        NODE_ENV: 'development',
        WT_URL: url
      },
      ignore: [
        'assets/app/',
        'build/webpack',
        'server/data.json',
        'client/',
        'tests/',
        'node_modules/'
      ]
    });

    setTimeout(() => {
      const publicUrl = `${url.replace('https://', 'http://')}/login`;
      open(publicUrl);
      util.log('Public Url:', publicUrl);
    }, 4000);
  });
});
