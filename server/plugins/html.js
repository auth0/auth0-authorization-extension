import fs from 'fs';
import { promisify } from 'util';

import ejs from 'ejs';
import path from 'path';
import { urlHelpers } from 'auth0-extension-hapi-tools';

import config from '../lib/config';
import template from '../views/index';

const readFile = promisify(fs.readFile);

const assembleHtmlRoute = (link) => ({
  method: 'GET',
  path: link,
  options: {
    description: 'Render HTML',
    auth: false
  },
  handler: async (req, h) => {
    const cfg = {
      AUTH0_DOMAIN: config('AUTH0_DOMAIN'),
      AUTH0_CLIENT_ID: config('AUTH0_CLIENT_ID'),
      BASE_URL: urlHelpers.getBaseUrl(req),
      API_BASE: urlHelpers.getBaseUrl(req),
      BASE_PATH: urlHelpers.getBasePath(req),
      SEARCH_ENGINE: (
        (config('AUTH0_RTA').replace('https://', '') === 'auth0.auth0.com') ||
        config('IS_LAYER0_TEST_SPACE')
      )
        ? 'v3'
        : 'v2'
    };

    // Development.
    if (process.env.NODE_ENV === 'development') {
      return h.response(ejs.render(template, {
        config: {
          ...cfg,
          API_BASE: 'http://localhost:3000/'
        },
        assets: {
          app: '/app/bundle.js'
          // app: '/app/auth0-authz.ui.2.12.0.js'
        }
      }));
    }

    // Render from CDN.
    const clientVersion = config('CLIENT_VERSION');
    if (clientVersion) {
      return h.response(ejs.render(template, {
        config: cfg,
        assets: { version: clientVersion }
      }));
    }

    // Render locally.
    const data = await readFile(path.join(__dirname, '../../dist/manifest.json'), 'utf8');
    const locals = {
      config: cfg,
      assets: {
        app: '/app/bundle.js'
      }
    };


    if (data) {
      locals.assets = JSON.parse(data);

      if (locals.assets.app) {
        locals.assets.app = `/app/${locals.assets.app}`;
      }

      if (locals.assets.vendors) {
        locals.assets.vendors = `/app/${locals.assets.vendors}`;
      }

      if (locals.assets.style) {
        locals.assets.style = `/app/${locals.assets.style}`;
      }
    }

    // Render the HTML page.
    return h.response(ejs.render(template, locals));
  }
});

const clientRoutes = [
  '/',
  '/api',
  '/configuration',
  '/configuration/rule',
  '/configuration/api',
  '/roles',
  '/roles/{id}',
  '/groups',
  '/groups/{id}',
  '/permissions',
  '/permissions/{id}',
  '/users',
  '/users/{id}',
  '/import-export'
];

export const register = async (server) => {
  clientRoutes.map(link => server.route(assembleHtmlRoute(link)));
};

export const htmlPlugin = {
  register,
  name: 'html'
};

