import Boom from '@hapi/boom';
import logger from '../lib/logger';

function notFound(message) {
  return this.response(Boom.notFound(message));
}

function error(err) {
  logger.error(err);
  const errorMessage = (err.message && err.message.error) || err.message || err.code || err.name || err.text || err.description || err;

  if (err.message && err.message.statusCode === 429) {
    return this.response(Boom.tooManyRequests(errorMessage));
  }

  return this.response(Boom.badRequest(errorMessage));
}

function unauthorized(message) {
  return this.response(Boom.unauthorized(message));
}

const register = async (server) => {
  server.decorate('reply', 'notFound', notFound);
  server.decorate('reply', 'error', error);
  server.decorate('reply', 'unauthorized', unauthorized);
};

export const replyDecoratorsPlugin = {
  register,
  name: 'reply-decorators'
};
