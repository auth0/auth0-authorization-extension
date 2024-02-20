import schema from '../schemas/group';

export default () => ({
  method: 'POST',
  path: '/api/groups',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'create:groups' ]
    },
    description: 'Create a new group.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      payload: schema
    }
  },
  handler: async (req, h) => {
    const group = req.payload;
    const created = await req.storage.createGroup(group);
    return h.response(created);
  }
});
