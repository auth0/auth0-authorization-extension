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
  handler: (req, reply) =>
    req.storage.provider.storageContext.read()
      .then(result => reply(result))
      .catch(err => reply.error(err))
});
