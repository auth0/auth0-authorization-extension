module.exports = () => ({
  method: 'GET',
  path: '/api/permissions',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:permissions' ]
    },
    description: 'Get all permissions in the system.'
  },
  handler: (req, reply) =>
    req.storage.getPermissions()
      .then(permissions => reply(permissions))
      .catch(err => reply.error(err))
});
