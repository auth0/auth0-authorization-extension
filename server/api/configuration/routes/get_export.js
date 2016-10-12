import Promise from 'bluebird';

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
    const promises = {
      configuration: req.storage.getConfiguration(),
      groups: req.storage.getGroups(),
      roles: req.storage.getRoles(),
      rules: req.storage.getRules(),
      permissions: req.storage.getPermissions(),
      applications: req.storage.getApplications()
    };

    return Promise.props(promises)
      .then(result => ({
        configuration: result.configuration,
        groups: result.groups,
        roles: result.roles,
        rules: result.rules,
        permissions: result.permissions,
        applications: result.applications
      }))
      .then(result => reply(result))
      .catch(err => reply.error(err));
  }
});
