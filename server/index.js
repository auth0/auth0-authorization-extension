import Hapi from '@hapi/hapi';
import inertPlugin from '@hapi/inert';
import Blipp from 'blipp';
import jwt from 'hapi-auth-jwt2';
import GoodConsole from '@hapi/good-console';
import HapiSwagger from 'hapi-swagger';
import Joi from 'joi';

import config from './lib/config';
import logger from './lib/logger';
import plugins from './plugins';

export default async () => {
  const goodPlugin = {
    plugin: { ...require('@hapi/good').plugin, name: '@hapi/good' },
    options: {
      ops: {
        interval: 30000
      },
      reporters: {
        console: []
      }
    }
  };

  if (process.env.NODE_ENV !== 'test') {
    goodPlugin.options.reporters.console.push(
      new GoodConsole({ color: !!config('LOG_COLOR') })
    );
    goodPlugin.options.reporters.console.push('stdout');
  }

  const server = new Hapi.Server({
    host: 'localhost',
    port: 3000,
    routes: { cors: true }
  });

  server.validator(Joi);

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

  await server.register([ ...externalPlugins, ...plugins ]);

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

  server.ext('onPreResponse', (request, h) => {

    // status prop can be either statusCode or status
    const statusCode = request.response?.statusCode ?? request.response?.status;

    // translate errors to appropriate responses
    // otherwise 500s are returned regardless of the thrown error
    if (statusCode >= 400) {
      request.response.output.statusCode = statusCode;
      request.response.output.payload = {
        statusCode: statusCode,
        error: request.response.name === "APIError" ? "Bad Request" : request.response.name,
        message: request.response.message
      };
    }

    if (request.response && request.response.isBoom) {
      server.log([ 'error' ], `Request: ${request.method.toUpperCase()} ${request.path}`);
      server.log([ 'error' ], `Response: ${JSON.stringify(request.response, null, 2)}`);
    }

    return h.continue;
  });

  return server;
};
