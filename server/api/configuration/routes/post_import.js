import { Promise } from 'bluebird';
import schema from '../schemas/storage';

export default () => ({
  method: 'POST',
  path: '/api/configuration/import',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:configuration' ]
    },
    validate: {
      payload: schema
    }
  },
  handler: async (req, h) => {
    if (
      !req.storage.provider ||
      !req.storage.provider.storageContext ||
      typeof req.storage.provider.storageContext.write !== 'function'
    ) {
      throw new Error('Unable to use "import" without proper storage');
    }

    if (req.storage.provider.storageContext.storage && req.storage.provider.storageContext.storage.set) {
      const setAysnc = Promise.promisify(req.storage.provider.storageContext.storage.set);
      await setAysnc(req.payload, { force: true });
      return h.response().code(204);
    }

    await req.storage.provider.storageContext.write(req.payload);
    return h.response().code(204);
  }
});
