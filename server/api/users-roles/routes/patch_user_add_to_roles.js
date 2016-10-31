import Promise from 'bluebird';
import Joi from 'joi';

module.exports = () => ({
  method: 'PATCH',
  path: '/api/users/{id}/roles',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'update:roles' ]
    },
    description: 'Add a single user to roles.',
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
        if (role.users.indexOf(req.params.id) === -1) {
          role.users.push(req.params.id);
        }

        return req.storage.updateRole(id, role);
      }))
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
