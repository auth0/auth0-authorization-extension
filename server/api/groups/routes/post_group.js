import schema from '../schemas/group';

module.exports = () => ({
  method: 'POST',
  path: '/api/groups',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'create:groups' ]
    },
    description: 'Create a new group.',
    tags: ['api'],
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
