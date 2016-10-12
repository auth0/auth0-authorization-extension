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
    const data = req.payload;

    req.storage.importData(data)
      .then(imported => reply(imported))
      .catch(err => reply.error(err));
  }
});
