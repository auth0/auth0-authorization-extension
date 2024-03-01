import { handlers } from 'auth0-extension-hapi-tools';
import * as tools from 'auth0-extension-tools';
import * as Boom from '@hapi/boom';

import config from '../lib/config';
import logger from '../lib/logger';

const validateHookToken = (domain, webtaskUrl, extensionSecret) => {
  console.log({ fn: 'validateHookToken' });

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

  console.log('validateHookToken got to stage 2');

  return hookPath => {
    if (hookPath === null || hookPath === undefined) {
      throw new tools.ArgumentError('Must provide the hookPath');
    }

    if (typeof hookPath !== 'string' || hookPath.length === 0) {
      throw new tools.ArgumentError(`The provided hookPath is invalid: ${hookPath}`);
    }

    console.log('validateHookToken got to stage 3');

    return {
      method(req, res) {
        console.log('validateHookToken return method');
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          const token = req.headers.authorization.split(' ')[1];

          try {
            logger.info(`Validating hook token with signature: ${extensionSecret.substr(0, 4)}...`);
            if (tools.validateHookToken(domain, webtaskUrl, hookPath, extensionSecret, token)) {
              console.log('validateHookToken got to stage 4');
              return res();
            }
          } catch (e) {
            logger.error('Invalid token:', token);
            return res(Boom.Boom(e, { statusCode: 401, message: e.message }));
          }
        }

        console.log('validateHookToken got to stage 5');
        const err = new tools.HookTokenError(`Hook token missing for the call to: ${hookPath}`);
        return res(Boom.unauthorized(err, 401, err.message));
      }
    };
  };
};

const register = async (server) => {
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
};


export const handlersPlugin = {
  register,
  name: 'handlers'
};
