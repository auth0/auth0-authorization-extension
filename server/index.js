import Hapi from '@hapi/hapi';
import Inert from 'inert';
import Relish from 'relish';
import Blipp from 'blipp';
import jwt from 'hapi-auth-jwt2';
import GoodConsole from '@hapi/good-console';
import HapiSwagger from 'hapi-swagger';

import config from './lib/config';
import logger from './lib/logger';
import plugins from './plugins';

export default async () => {
  const goodPlugin = {
    plugin: require('@hapi/good'),
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

  const hapiSwaggerPlugin = {
    plugin: HapiSwagger,
    options: {
      documentationPage: false,
      swaggerUI: false
    }
  };

  if (process.env.NODE_ENV !== 'test') {
    goodPlugin.options.reporters.console.push(
      new GoodConsole({ color: !!config('LOG_COLOR') })
    );
    goodPlugin.options.reporters.console.push('stdout');
  }

  const relishPlugin = Relish({ });

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

  try {
    await server.register([ goodPlugin, Inert, Blipp, jwt, hapiSwaggerPlugin, ...plugins ]);
  } catch (error) {
    logger.error('Error during plugin registration');
    logger.error(error);
    if (error.stack) {
      logger.error(error.stack);
    }
  }

  server.ext('onPreResponse', (request, h) => {
    if (request.response && request.response.isBoom && request.response.output) {
      server.log([ 'error' ], `Request: ${request.method.toUpperCase()} ${request.url.path}`);
      server.log([ 'error' ], `Response: ${JSON.stringify(request.response, null, 2)}`);
    }

    return h.continue;
  });

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

  return server;
};
