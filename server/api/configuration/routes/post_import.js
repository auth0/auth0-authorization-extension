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
    req.storage.provider.storageContext.write(req.payload)
      .then(imported => reply(imported))
      .catch(err => reply.error(err));
  }
});
