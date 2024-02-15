import _ from 'lodash';
import Joi from 'joi';

export default () => ({
  method: 'GET',
  path: '/api/permissions',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:permissions' ]
    },
    description: 'Get all permissions in the system.',
    tags: [ 'api' ],
    validate: {
      query: Joi.object({
        q: Joi.string().max(1000).allow('').default(''),
        field: Joi.string().max(1000).allow('').default('')
      })
    }
  },
  handler: (req, reply) =>
    req.storage.getPermissions()
      .then(permissions => ({
        permissions: _.filter(permissions, (item) => {
          // if exists, filter by search value
          const searchQuery = req.query.q;
          if (!searchQuery) return true;

          const field = req.query.field;
          return _.includes(item[field].toLowerCase(), searchQuery.toLowerCase());
        }),
        total: permissions.length
      }))
      .then(permissions => reply(permissions))
      .catch(err => reply.error(err))
});
