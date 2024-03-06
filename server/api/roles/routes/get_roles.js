import _ from 'lodash';
import Joi from 'joi';

export default () => ({
  method: 'GET',
  path: '/api/roles',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:roles' ]
    },
    description: 'Get all roles in the system.',
    tags: [ 'api' ],
    validate: {
      query: Joi.object({
        q: Joi.string().max(1000).allow('').default(''),
        field: Joi.string().max(1000).allow('').default('')
      })
    }
  },
  handler: async (req, h) => {
    const roles = await req.storage.getRoles();
    const result = ({
      roles: _.filter(roles, (item) => {
        // if exists, filter by search value
        const searchQuery = req.query.q;
        if (!searchQuery) return true;

        const field = req.query.field;
        return _.includes(item[field].toLowerCase(), searchQuery.toLowerCase());
      }),
      total: roles.length
    });

    return h.response(result);
  }
});
