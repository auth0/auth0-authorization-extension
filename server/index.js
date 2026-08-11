import Hapi from '@hapi/hapi';
import inertPlugin from '@hapi/inert';
import Blipp from 'blipp';
import jwt from 'hapi-auth-jwt2';
import GoodConsole from '@hapi/good-console';
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
    // In dev bind all interfaces so the Vivaldi nginx container can reach the
    // listener via host.docker.internal (a non-loopback host IP). Prod runs as
    // a webtask and never hits this path.
    host: process.env.NODE_ENV === 'development' ? '0.0.0.0' : 'localhost',
    port: 3000,
    routes: { cors: true }
  });

  server.validator(Joi);

  const externalPlugins = [
    goodPlugin,
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

      // Preserve domain/business error names (ValidationError, NotFoundError, ArgumentError)
      // but map infrastructure error names (ManagementApiError, etc.) to standard HTTP error names
      let errorName = request.response.name;
      const domainErrors = ['ValidationError', 'NotFoundError', 'ArgumentError'];
      const shouldPreserveName = errorName && domainErrors.includes(errorName);

      if (!shouldPreserveName) {
        if (statusCode === 400) {
          errorName = "Bad Request";
        } else if (statusCode === 401) {
          errorName = "Unauthorized";
        } else if (statusCode === 403) {
          errorName = "Forbidden";
        } else if (statusCode === 404) {
          errorName = "Not Found";
        } else if (statusCode === 429) {
          errorName = "Too Many Requests";
        }
      }

      request.response.output.payload = {
        statusCode: statusCode,
        error: errorName,
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
