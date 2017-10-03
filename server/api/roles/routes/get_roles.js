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
    tags: [ 'api' ],
    validate: {
      query: {
        q: Joi.string().max(1000).allow('').default(''),
        field: Joi.string().max(1000).allow('').default(''),
        select: Joi.string().max(1000).allow('').default('')
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getRoles()
      .then(roles => {
        const fields = _.chain(req.query.field).split(',').map(_.trim).value();
        const queries = _.chain(req.query.q).split(',').map(_.trim).value();
        const predicate = _.zipObject(fields, queries);
        const filteredRoles = _.filter(roles, predicate);
        const selectedRoles = _.chain(req.query.select).split(',').map(_.trim).value();
        return {
          roles: req.query.select ? _.map(filteredRoles, role => _pick(role, selectedRoles)) : filteredRoles,
          total: filteredRoles.length
        }
      })
      .then(roles => reply(roles))
      .catch(err => reply.error(err))
});
