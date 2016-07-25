import Joi from 'joi';
import schema from '../schemas/role';

module.exports = () => ({
  method: 'PUT',
  path: '/api/roles/{id}',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    },
    description: 'Update a role.',
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
    const role = req.payload;
    return req.storage.updateRole(req.params.id, role)
      .then((updated) => reply(updated))
      .catch(err => reply.error(err));
  }
});
