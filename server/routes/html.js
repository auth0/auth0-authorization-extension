import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import nconf from 'nconf';

export default () => {
  const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>Auth0 - Identity &amp; Access Management Dashboard</title>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/2.0.1/lib/logos/img/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.973/css/index.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/3.1.10/index.css">
    <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>"><% } %>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/javascript" src="//cdn.auth0.com/js/lock-9.0.min.js"></script>
    <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.973/components/ZeroClipboard/ZeroClipboard.js"></script>
    <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.973/js/bundle.js"></script>
    <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
    <% if (assets.vendors) { %><script type="text/javascript" src="/app/<%= assets.vendors %>"></script><% } %>
    <script type="text/javascript" src="/app/<%= assets.app %>"></script>
  </body>
  </html>
  `;

  return (req, res, next) => {
    if (req.url.indexOf('/api') === 0) {
      return next();
    }

    return fs.readFile(path.join(__dirname, '../../dist/manifest.json'), 'utf8', (err, data) => {
      const locals = {
        config: {
          AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
          AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID')
        },
        assets: {
          app: 'bundle.js'
        }
      };

      if (!err && data) {
        locals.assets = JSON.parse(data);
      }

      // Render the HTML page.
      res.send(ejs.render(template, locals));
    });
  };
};
