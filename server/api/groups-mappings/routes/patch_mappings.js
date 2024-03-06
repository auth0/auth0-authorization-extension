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
  handler: async (req, h) => {
    const mappings = req.payload;

    const group = await req.storage.getGroup(req.params.id);

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

    await req.storage.updateGroup(req.params.id, group);

    return h.response.code(204);
  }
});
