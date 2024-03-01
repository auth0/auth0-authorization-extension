import Hapi from '@hapi/hapi';
import inertPlugin from 'inert';
import Relish from 'relish';
import Blipp from 'blipp';
import jwt from 'hapi-auth-jwt2';
import GoodConsole from '@hapi/good-console';
import HapiSwagger from 'hapi-swagger';

import config from './lib/config';
import logger from './lib/logger';
import plugins from './plugins';

export default (cb) => {
  const goodPlugin = {
    plugin: { ...require('@hapi/good').plugin, name: '@hapi/good' },
    options: {
      ops: {
        interval: 30000
      },
      reporters: {
        console: [

        ]
      }
    }
  };

  if (process.env.NODE_ENV !== 'test') {
    goodPlugin.options.reporters.console.push(
      new GoodConsole({ color: !!config('LOG_COLOR') })
    );
    goodPlugin.options.reporters.console.push('stdout');
  }

  const relishPlugin = Relish({});

  const server = new Hapi.Server({
    host: 'localhost',
    port: 3000,
    routes: {
      cors: true,
      validate: {
        failAction: relishPlugin.failAction
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/test',
    options: { auth: false },
    handler: (request, h) => {
      console.log({ fn: 'GET /test route handler' });
      return h.response({ route: 'GET /test', status: 'awesome' });
    }
  });

  server.events.on('start', () => {
    console.log('Server started');
  });

  // server.ext('onRequest', function(hapiRequest, h) {
  //   console.log({ fn: 'server.ext(onRequest)' });
  //   return h.continue;
  // });

  // server.events.on('route', (route) => {
  //   console.log(`New route added: ${route.path}`);
  // });

  const externalPlugins = [
    goodPlugin,
    {
      plugin: { ...HapiSwagger, name: 'hapi-swagger' },
      options: {
        documentationPage: false,
        swaggerUI: false
      }
    },
    {
      plugin: { ...inertPlugin, name: 'inert' }
    },
    {
      plugin: { ...Blipp, name: 'blipp' }
    },
    {
      plugin: { ...jwt, name: 'jwt' }
    }
  ];

  // server.start()
  //   .then(() => {
  //     // Use the server logger.
  //     logger.debug = (...args) => {
  //       server.log([ 'debug' ], args.join(' '));
  //     };
  //     logger.info = (...args) => {
  //       server.log([ 'info' ], args.join(' '));
  //     };
  //     logger.error = (...args) => {
  //       server.log([ 'error' ], args.join(' '));
  //     };

  //     cb(null, server);
  //   }).catch(err => cb(err, null));

  server.register([ ...externalPlugins, ...plugins ])
    // .then(() => server.start())
    .then(() => {
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

      cb(null, server);
    }).catch(err => cb(err, null));

  server.ext('onPreResponse', (request, h) => {
    if (request.response && request.response.isBoom && request.response.output) {
      server.log([ 'error' ], `Request: ${request.method.toUpperCase()} ${request.path}`);
      server.log([ 'error' ], `Response: ${JSON.stringify(request.response, null, 2)}`);
    }

    return h.continue;
  });

  return server;
};
