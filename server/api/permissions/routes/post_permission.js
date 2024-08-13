import schema from '../schemas/permission';

export default () => ({
  method: 'POST',
  path: '/api/permissions',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'create:permissions' ]
    },
    description: 'Create a new permission.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      payload: schema
    }
  },
  handler: async (req, h) => {
    const permission = req.payload;
    const created = await req.storage.createPermission(permission);

    return h.response(created);
  }
});
