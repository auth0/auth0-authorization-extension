import uuid from 'node-uuid';
import schema from '../schemas/mappings';

export default () => ({
  method: 'PATCH',
  path: '/api/groups/{id}/mappings',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Create one or more mappings in a group.',
    tags: [ 'api' ],
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
