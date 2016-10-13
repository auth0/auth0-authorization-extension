module.exports = () => ({
  method: 'GET',
  path: '/api/configuration/export',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    }
  },
  handler: (req, reply) => {
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
