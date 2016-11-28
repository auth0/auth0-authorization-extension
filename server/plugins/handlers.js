import { handlers } from 'auth0-extension-hapi-tools';
import config from '../lib/config';
import logger from '../lib/logger';

const tools = require('auth0-extension-tools');
const Boom = require('boom');

const validateHookToken = function (domain, webtaskUrl, extensionSecret) {
  if (domain === null || domain === undefined) {
    throw new tools.ArgumentError('Must provide the domain');
  }

  if (typeof domain !== 'string' || domain.length === 0) {
    throw new tools.ArgumentError(`The provided domain is invalid: ${domain}`);
  }

  if (webtaskUrl === null || webtaskUrl === undefined) {
    throw new tools.ArgumentError('Must provide the webtaskUrl');
  }

  if (typeof webtaskUrl !== 'string' || webtaskUrl.length === 0) {
    throw new tools.ArgumentError(`The provided webtaskUrl is invalid: ${webtaskUrl}`);
  }

  if (extensionSecret === null || extensionSecret === undefined) {
    throw new tools.ArgumentError('Must provide the extensionSecret');
  }

  if (typeof extensionSecret !== 'string' || extensionSecret.length === 0) {
    throw new tools.ArgumentError(`The provided extensionSecret is invalid: ${extensionSecret}`);
  }

  return function (hookPath) {
    if (hookPath === null || hookPath === undefined) {
      throw new tools.ArgumentError('Must provide the hookPath');
    }

    if (typeof hookPath !== 'string' || hookPath.length === 0) {
      throw new tools.ArgumentError(`The provided hookPath is invalid: ${hookPath}`);
    }

    return {
      method(req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          const token = req.headers.authorization.split(' ')[1];

          try {
            logger.info(`Validating hook token with signature: ${extensionSecret.substr(0, 4)}...`);
            if (tools.validateHookToken(domain, webtaskUrl, hookPath, extensionSecret, token)) {
              return res();
            }
          } catch (e) {
            logger.error('Invalid token:', token);
            return res(Boom.wrap(e, 401, e.message));
          }
        }

        const err = new tools.HookTokenError(`Hook token missing for the call to: ${hookPath}`);
        return res(Boom.unauthorized(err, 401, err.message));
      }
    };
  };
};

module.exports.register = (server, options, next) => {
  server.decorate('server', 'handlers', {
    managementClient: handlers.managementApiClient({
      domain: config('AUTH0_DOMAIN'),
      clientId: config('AUTH0_CLIENT_ID'),
      clientSecret: config('AUTH0_CLIENT_SECRET'),
      logger: logger.error
    }),
    validateHookToken: validateHookToken(
      config('AUTH0_DOMAIN'),
      config('WT_URL'),
      config('EXTENSION_SECRET')
    )
  });

  next();
};

module.exports.register.attributes = {
  name: 'handlers'
};
