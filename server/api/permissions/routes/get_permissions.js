import _ from 'lodash';
import Joi from 'joi';

module.exports = () => ({
  method: 'GET',
  path: '/api/permissions',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'read:permissions' ]
    },
    description: 'Get all permissions in the system.',
    validate: {
      query: {
        q: Joi.string().max(1000).allow('').default(''),
        field: Joi.string().max(1000).allow('').default('')
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getPermissions()
      .then(permissions => _.filter(permissions, (item) => {
        // if exists, filter by search value
        const searchQuery = req.query.q;
        if (!searchQuery) return true;

        const field = req.query.field;
        return _.includes(item[field].toLowerCase(), searchQuery.toLowerCase());
      }))
      .then(permissions => reply(permissions))
      .catch(err => reply.error(err))
});
