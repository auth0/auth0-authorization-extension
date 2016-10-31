import uuid from 'node-uuid';
import schema from '../schemas/mappings';

module.exports = () => ({
  method: 'PATCH',
  path: '/api/groups/{id}/mappings',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Create one or more mappings in a group.',
    validate: {
      options: {
        allowUnknown: false
      },
      payload: schema
    }
  },
  handler: (req, reply) => {
    const mappings = req.payload;

    req.storage.getGroup(req.params.id)
      .then(group => {
        if (!group.mappings) {
          group.mappings = [];
        }

        mappings.forEach(mapping => {
          group.mappings.push({
            _id: uuid.v4(),
            groupName: mapping.groupName,
            connectionName: mapping.connectionName
          });
        });

        return req.storage.updateGroup(req.params.id, group);
      })
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
