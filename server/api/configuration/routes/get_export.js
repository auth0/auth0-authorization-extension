import config from '../../../lib/config';
import { mongoExport } from '../../../lib/mongoTools';

module.exports = () => ({
  method: 'GET',
  path: '/api/configuration/export',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:configuration' ]
    }
  },
  handler: (req, reply) => {
    if (config('STORAGE_TYPE') === 'mongodb') {
      return mongoExport(req.storage)
        .then(result => reply(result))
        .catch(err => reply.error(err));
    }

    if (
      !req.storage.provider ||
      !req.storage.provider.storageContext ||
      typeof req.storage.provider.storageContext.read !== 'function'
    ) {
      return reply.error(new Error('Unable to use "export" without proper storage'));
    }

    return req.storage.provider.storageContext.read()
      .then(result => reply(result))
      .catch(err => reply.error(err));
  }
});
