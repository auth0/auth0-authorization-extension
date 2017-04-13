const fs = require('fs');
const Sandbox = require('sandboxjs');
const npm = require('npm');

const WEBTASK_TOKEN = process.env.WEBTASK_TOKEN;
const WEBTASK_CONTAINER = process.env.WEBTASK_CONTAINER;
const EXTENSION_VERSION = process.env.npm_package_version;

const containers = [
    {
        wtToken: WEBTASK_TOKEN,
        wtContainer: WEBTASK_CONTAINER,
        remoteUrl: '',
        env: {
            foo: 'bar'
        }
    }
];


npm.load((err) => {
    if (err) throw err;

    npm.commands.run(['build'], (err) => {
        if (err) throw err;

        const code = fs.readFileSync(`./dist/auth0-authz.extension.${EXTENSION_VERSION}.js`).toString();

        for (var i = 0; i < containers.length; i++) {
            const container = containers[i];
            const profile =  Sandbox.init({
                url: 'https://sandbox.it.auth0.com',
                token: container.wtToken,
                container: container.wtContainer
            });

            profile.create(code, { secrets: container.env })
                .then((webtask) => {
                    container.remoteUrl = webtask.url;

                    console.log('webtask', webtask);
                    console.log('container', container);
                })
                .catch(err => { throw err; });
        }
    });
});