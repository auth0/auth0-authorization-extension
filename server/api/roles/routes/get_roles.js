import _ from 'lodash';
import Joi from 'joi';

module.exports = () => ({
  method: 'GET',
  path: '/api/roles',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:roles' ]
    },
    description: 'Get all roles in the system.',
    validate: {
      query: {
        q: Joi.string().max(1000).allow('').default(''),
        field: Joi.string().max(1000).allow('').default('')
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getRoles()
      .then(roles => _.filter(roles, (item) => {
        // if exists, filter by search value
        const searchQuery = req.query.q;
        if (!searchQuery) return true;

        const field = req.query.field;
        return _.includes(item[field].toLowerCase(), searchQuery.toLowerCase());
      }))
      .then(roles => reply(roles))
      .catch(err => reply.error(err))
});
