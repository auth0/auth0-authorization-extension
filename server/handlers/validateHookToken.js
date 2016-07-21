import path from 'path';
import Boom from 'boom';
import jwt from 'jsonwebtoken';

import config from '../lib/config';
import logger from '../lib/logger';

module.exports = (hookPath) => ({
  method: (req, res) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, config('EXTENSION_SECRET'), {
          audience: path.join(config('WT_URL'), hookPath),
          issuer: `https://${config('AUTH0_DOMAIN')}`
        });

        return res();
      } catch (e) {
        logger.error('Invalid hook token', e);
        return res(Boom.unauthorized('Invalid hook token'));
      }
    }

    logger.error('Hook token is missing.');
    return res(Boom.unauthorized('Hook token is missing'));
  }
});
