import Boom from 'boom';

import config from '../lib/config';
import logger from '../lib/logger';
import managementApiClient from '../lib/managementApiClient';

module.exports = {
  method: (req, res) => {
    managementApiClient.getForClient(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'))
      .then(auth0 => res(auth0))
      .catch((err) => {
        logger.error(err.message || err.code);
        res(Boom.wrap(err));
      });
  },
  assign: 'auth0'
};
