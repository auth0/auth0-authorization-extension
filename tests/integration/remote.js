const fs = require('fs');
const Sandbox = require('sandboxjs');
const npm = require('npm');

const EXTENSION_VERSION = process.env.npm_package_version;

const {
    WEBTASK_TOKEN,
    WEBTASK_CONTAINER,
    AUTH0_DOMAIN,
    AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET
} = process.env;


const containers = [
    {
        name: 'authz-with-wt-storage',
        env: {
            AUTH0_DOMAIN,
            AUTH0_CLIENT_ID,
            AUTH0_CLIENT_SECRET,
            AUTHORIZE_API_KEY: "mysecret",
            EXTENSION_SECRET: "mysecret",
            WT_URL: `https://${WEBTASK_CONTAINER}.us.webtask.io/authz-with-wt-storage`
        }
    }
];

npm.load((err) => {
    if (err) throw err;

    npm.commands.run(['extension:build'], (err) => {
        if (err) throw err;

        const code = fs.readFileSync(`./dist/auth0-authz.extension.${EXTENSION_VERSION}.js`).toString();

        for (var i = 0; i < containers.length; i++) {
            const container = containers[i];
            const profile =  Sandbox.init({
                url: 'https://sandbox.it.auth0.com',
                token: WEBTASK_TOKEN,
                container: WEBTASK_CONTAINER
            });

            profile.create(code, {
                secrets: container.env,
                name: container.name
            })
            .then((webtask) => {
                process.env.INT_AUTHZ_API_URL = `${webtask.url}/api`;

                npm.commands.run(['int-test'], (err) => {
                    if (err) throw err;

                    console.log('tests finished');
                });
            })
            .catch(err => { throw err; });
        }
    });
});