module.exports = () => ({
  method: 'GET',
  path: '/api/roles',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:roles' ]
    },
    description: 'Get all roles in the system.'
  },
  handler: (req, reply) =>
    req.storage.getRoles()
      .then(roles => reply(roles))
      .catch(err => reply.error(err))
});
