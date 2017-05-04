import schema from '../schemas/storage';

module.exports = () => ({
  method: 'POST',
  path: '/api/configuration/import',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:configuration' ]
    },
    validate: {
      payload: schema
    }
  },
  handler: (req, reply) => {
    if (
      !req.storage.provider ||
      !req.storage.provider.storageContext ||
      typeof req.storage.provider.storageContext.write !== 'function'
    ) {
      return reply.error(new Error('Unable to use "import" without proper storage'));
    }

    return req.storage.provider.storageContext.storage.set(req.payload, { force: true }, (err) => {
      if (err) {
        return reply.error(err);
      }

      return reply().code(204);
    });
  }
});
