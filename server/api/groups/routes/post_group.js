import schema from '../schemas/group';

module.exports = () => ({
  method: 'POST',
  path: '/api/groups',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    },
    description: 'Create a new group.',
    validate: {
      options: {
        allowUnknown: false
      },
      payload: schema
    }
  },
  handler: (req, reply) => {
    const group = req.payload;
    return req.storage.createGroup(group)
      .then((created) => reply(created))
      .catch(err => reply.error(err));
  }
});
