import Hapi from 'hapi';
import Good from 'good';
import Inert from 'inert';
import 'good-console';

import plugins from './plugins';
import config from './lib/config';
import logger from './lib/logger';

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

  const server = new Hapi.Server();
  server.connection({ port: config('PORT') });
  server.register([ goodPlugin, Inert, ...plugins ], (err) => {
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
