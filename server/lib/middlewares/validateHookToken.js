import path from 'path';
import jwt from 'jsonwebtoken';

import config from '../config';
import logger from '../logger';

module.exports = (hookPath) =>
  (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      const token = req.headers.authorization.split(' ')[1];
      const isValid = jwt.verify(token, config('EXTENSION_SECRET'), {
        audience: path.join(config('WT_URL'), hookPath),
        issuer: `https://${config('AUTH0_DOMAIN')}`
      });

      if (!isValid) {
        logger.error('Invalid hook token:', token);
        return res.sendStatus(401);
      }

      return next();
    }

    logger.error('Hook token is missing.');
    return res.sendStatus(401);
  };
