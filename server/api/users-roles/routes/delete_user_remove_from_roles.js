import Promise from 'bluebird';
import Joi from 'joi';

module.exports = () => ({
  method: 'DELETE',
  path: '/api/users/{id}/roles',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:roles' ]
    },
    description: 'Remove a single user from roles.',
    validate: {
      params: {
        id: Joi.string().required()
      },
      payload: Joi.array().items(Joi.string().guid()).required().min(1)
    }
  },
  handler: (req, reply) => {
    const roleIds = req.payload;

    return Promise.mapSeries(roleIds, id => req.storage.getRole(id)
      .then(role => {
        if (!role.users) {
          role.users = []; // eslint-disable-line no-param-reassign
        }
        const index = role.users.indexOf(req.params.id);
        if (index > -1) {
          role.users.splice(index, 1);
        }

        return req.storage.updateRole(id, role);
      }))
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
