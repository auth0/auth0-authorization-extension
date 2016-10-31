import 'good-console';
import Hapi from 'hapi';
import Good from 'good';
import Inert from 'inert';
import Relish from 'relish';
import Blipp from 'blipp';
import jwt from 'hapi-auth-jwt2';
import * as tools from 'auth0-extension-hapi-tools';

import config from './lib/config';
import logger from './lib/logger';
import plugins from './plugins';
import { scopes } from './lib/apiaccess';

export default (cb) => {
  const goodPlugin = {
    register: Good,
    options: {
      ops: {
        interval: 30000
      },
      reporters: {
        console: [
          { module: 'good-console', args: [ { format: '' } ] },
          'stdout'
        ]
      }
    }
  };

  const relishPlugin = Relish({ });

  const server = new Hapi.Server();
  server.connection({
    host: 'localhost',
    port: config('PORT'),
    routes: {
      cors: true,
      validate: {
        failAction: relishPlugin.failAction
      }
    }
  });

  const session = {
    register: tools.plugins.dashboardAdminSession,
    options: {
      rta: config('AUTH0_RTA'),
      domain: config('AUTH0_DOMAIN'),
      scopes: 'create:resource_servers read:resource_servers update:resource_servers delete:resource_servers read:clients read:connections read:rules create:rules update:rules read:users update:users read:device_credentials read:logs',
      baseUrl: config('WT_URL'),
      audience: 'urn:api-authz',
      secret: config('EXTENSION_SECRET'),
      clientName: 'Authorization Extension',
      onLoginSuccess: (decoded, req, callback) => {
        if (decoded) {
          decoded.scope = scopes.map(scope => scope.value); // eslint-disable-line no-param-reassign
          return callback(null, true, decoded);
        }

        return callback(null, false);
      }
    }
  };
  server.register([ goodPlugin, Inert, Blipp, jwt, session, ...plugins ], (err) => {
    if (err) {
      return cb(err, null);
    }

    // Use the server logger.
    logger.debug = (...args) => {
      server.log([ 'debug' ], args.join(' '));
    };
    logger.info = (...args) => {
      server.log([ 'info' ], args.join(' '));
    };
    logger.error = (...args) => {
      server.log([ 'error' ], args.join(' '));
    };

    return cb(null, server);
  });
};
