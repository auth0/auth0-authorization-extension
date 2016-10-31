import fs from 'fs';
import url from 'url';
import ejs from 'ejs';
import path from 'path';

import config from '../lib/config';
import template from '../views/index';

const assembleHtmlRoute = (link) => ({
  method: 'GET',
  path: link,
  config: {
    description: 'Render HTML',
    auth: false
  },
  handler: (req, reply) => {
    const cfg = {
      AUTH0_DOMAIN: config('AUTH0_DOMAIN'),
      AUTH0_CLIENT_ID: config('AUTH0_CLIENT_ID'),
      IS_ADMIN: true, // req.path === '/admins',
      BASE_URL: url.format({
        protocol: config('NODE_ENV') !== 'production' ? 'http' : 'https',
        host: req.headers.host,
        pathname: url.parse(req.originalUrl || '/').pathname.replace(req.path, '')
      }),
      BASE_PATH: url.parse(req.originalUrl || '/').pathname.replace(req.path, '') + (req.path === '/admins' ? '/admins' : '')
    };

    // Development.
    if (process.env.NODE_ENV === 'development') {
      return reply(ejs.render(template, {
        config: cfg,
        assets: {
          app: 'http://localhost:3001/app/bundle.js'
        }
      }));
    }

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
          app: '/app/bundle.js'
        }
      };

      if (!err && data) {
        locals.assets = JSON.parse(data);

        if (locals.assets.app) {
          locals.assets.app = `/app/${locals.assets.app}`;
        }

        if (locals.assets.vendors) {
          locals.assets.vendors = `/app/${locals.assets.vendors}`;
        }
      }

      // Render the HTML page.
      reply(ejs.render(template, locals));
    });
  }
});

const clientRoutes = [
  '/',
  '/configuration',
  '/configuration/rule',
  '/roles',
  '/roles/:id',
  '/groups',
  '/groups/:id',
  '/permissions',
  '/permissions/:id',
  '/users',
  '/users/:id',
  '/import-export'
];

module.exports.register = (server, options, next) => {
  clientRoutes.map(link => server.route(assembleHtmlRoute(link)));

  next();
};

module.exports.register.attributes = {
  name: 'html'
};
