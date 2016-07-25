import schema from '../schemas/role';

module.exports = () => ({
  method: 'POST',
  path: '/api/roles',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    },
    description: 'Create a new role.',
    validate: {
      options: {
        allowUnknown: false
      },
      payload: schema
    }
  },
  handler: (req, reply) => {
    const role = req.payload;
    return req.storage.createRole(role)
      .then((created) => reply(created))
      .catch(err => reply.error(err));
  }
});
