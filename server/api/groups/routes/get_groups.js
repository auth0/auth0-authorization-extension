module.exports = () => ({
  method: 'GET',
  path: '/api/groups',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    },
    description: 'Get all groups in the system.'
  },
  handler: (req, reply) =>
    req.storage.getGroups()
      .then(groups => groups.map(group => {
        const currentGroup = group;
        currentGroup.mappings = currentGroup.mappings || [];
        currentGroup.members = currentGroup.members || [];
        return currentGroup;
      }))
      .then(groups => reply(groups))
      .catch(err => reply.error(err))
});
