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
  handler: (req, reply) => {
    const permission = req.payload;
    return req.storage.createPermission(permission)
      .then((created) => reply(created))
      .catch(err => reply.error(err));
  }
});
