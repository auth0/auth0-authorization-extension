const fs = require('fs');
const Sandbox = require('sandboxjs');
const npm = require('npm');
const async = require('async');

const EXTENSION_VERSION = process.env.npm_package_version;

const {
  WEBTASK_TOKEN,
  WEBTASK_CONTAINER,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTHORIZE_API_KEY,
  EXTENSION_SECRET,
  S3_BUCKET,
  S3_PATH,
  S3_KEY,
  S3_SECRET
} = process.env;


const containers = [
  {
    name: 'authz-with-wt-storage',
    env: {
      AUTH0_DOMAIN,
      AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET,
      AUTHORIZE_API_KEY,
      EXTENSION_SECRET,
      WT_URL: `https://${WEBTASK_CONTAINER}.us.webtask.io/authz-with-wt-storage`
    }
  },
  {
    name: 'authz-with-s3-storage',
    env: {
      AUTH0_DOMAIN,
      AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET,
      AUTHORIZE_API_KEY,
      EXTENSION_SECRET,
      STORAGE_TYPE: 's3',
      S3_BUCKET,
      S3_PATH,
      S3_KEY,
      S3_SECRET,
      WT_URL: `https://${WEBTASK_CONTAINER}.us.webtask.io/authz-with-s3-storage`
    }
  }
];

npm.load((err) => {
  if (err) throw err;

  npm.commands.run(['extension:build'], (err) => {
    if (err) throw err;

    const code = fs.readFileSync(`./dist/auth0-authz.extension.${EXTENSION_VERSION}.js`).toString();

    async.eachSeries(containers, (container, callback) => {
      const profile = Sandbox.init({
        url: 'https://sandbox.it.auth0.com',
        token: WEBTASK_TOKEN,
        container: WEBTASK_CONTAINER
      });

      console.log(`Uploading code for ${container.name}`);

      profile.create(code, {
        secrets: container.env,
        name: container.name
      })
      .then((webtask) => {
        process.env.INT_AUTHZ_API_URL = `${webtask.url}/api`;

        console.log(`Running tests for ${container.name}`);
        npm.commands.run([ 'int-test' ], (err) => {
          if (err) callback(err);

          console.log(`Tests for ${container.name} have finished. Deleting webtask...`);

          profile.removeWebtask({ name: container.name })
            .then(() => {
              console.log(`Webtask container for ${container.name} removed.`);
              
              callback();
            })
            .catch(callback);
        });
      })
      .catch(err => { callback(err); });
    }, (err) => {
      console.log(err);
    });
  });
});
