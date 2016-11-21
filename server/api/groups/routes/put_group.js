import Joi from 'joi';
import schema from '../schemas/group';

module.exports = () => ({
  method: 'PUT',
  path: '/api/groups/{id}',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Update a group.',
    tags: ['api'],
    validate: {
      options: {
        allowUnknown: false
      },
      params: {
        id: Joi.string().guid().required()
      },
      payload: schema
    }
  },
  handler: (req, reply) => {
    const group = req.payload;
    return req.storage.updateGroup(req.params.id, group)
      .then((updated) => reply(updated))
      .catch(err => reply.error(err));
  }
});
