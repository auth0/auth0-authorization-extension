import schema from '../schemas/storage';

module.exports = () => ({
  method: 'POST',
  path: '/api/configuration/import',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
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

    return req.storage.provider.storageContext.write(req.payload)
      .then(() => reply())
      .catch(err => reply.error(err));
  }
});
