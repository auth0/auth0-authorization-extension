import fs from 'fs';
import url from 'url';
import ejs from 'ejs';
import path from 'path';

import config from '../lib/config';
import template from '../views/index';

module.exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: false
    },
    handler: (req, reply) => {
      const cfg = {
        AUTH0_DOMAIN: config('AUTH0_DOMAIN'),
        AUTH0_CLIENT_ID: config('AUTH0_CLIENT_ID'),
        IS_ADMIN: req.path === '/admins',
        BASE_URL: url.format({
          protocol: config('NODE_ENV') !== 'production' ? 'http' : 'https',
          host: req.headers.host,
          pathname: url.parse(req.originalUrl || '/').pathname.replace(req.path, '')
        }),
        BASE_PATH: url.parse(req.originalUrl || '/').pathname.replace(req.path, '') + (req.path === '/admins' ? '/admins' : '')
      };

      // Render from CDN.
      const clientVersion = config('CLIENT_VERSION');
      if (clientVersion) {
        return reply(ejs.render(template, {
          config: cfg,
          assets: { version: clientVersion }
        }));
      }

      // Render locally.
      return fs.readFile(path.join(__dirname, '../../dist/manifest.json'), 'utf8', (err, data) => {
        const locals = {
          config: cfg,
          assets: {
            app: 'bundle.js'
          }
        };

        if (!err && data) {
          locals.assets = JSON.parse(data);
        }

        // Render the HTML page.
        reply(ejs.render(template, locals));
      });
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'html'
};
