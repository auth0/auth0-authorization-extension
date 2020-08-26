require('@babel/register')();

const gulp = require('gulp');
const log = require('fancy-log');
const open = require('open');
const ngrok = require('ngrok');
const nodemon = require('gulp-nodemon');

gulp.task('run', async () => {
  const url = await ngrok.connect(3001);

  nodemon({
    script: './build/webpack/server.js',
    ext: 'js json',
    env: {
      EXTENSION_SECRET: 'a-random-secret',
      AUTH0_RTA: 'https://auth0.auth0.com',
      NODE_ENV: 'development',
      WT_URL: url,
      PUBLIC_WT_URL: url
    },
    ignore: [
      'assets/app/',
      'build/webpack',
      'server/data.json',
      'client/',
      'dist/',
      'tests/',
      'node_modules/'
    ]
  });

  setTimeout(() => {
    const publicUrl = `${url}/login`;
    open(publicUrl);
    log('Public Url:', publicUrl);
  }, 4000);
});
