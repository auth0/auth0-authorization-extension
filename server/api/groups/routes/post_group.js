import schema from '../schemas/group';

export default () => ({
  method: 'POST',
  path: '/api/groups',
  options: {
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
    // unit tests expect a 200 status code so for consistency this has not been updated to 201
    return h.response(created).code(200);
  }
});
