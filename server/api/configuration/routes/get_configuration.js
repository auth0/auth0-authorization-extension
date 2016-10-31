module.exports = () => ({
  method: 'GET',
  path: '/api/configuration',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'read:configuration' ]
    }
  },
  handler: (req, reply) =>
    req.storage.getConfiguration()
      .then(config => reply(config))
      .catch(err => reply.error(err))
});
