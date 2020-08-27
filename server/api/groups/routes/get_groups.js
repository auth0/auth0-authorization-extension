import _ from 'lodash';
import Joi from 'joi';

export default () => ({
  method: 'GET',
  path: '/api/groups',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get all groups in the system.',
    tags: [ 'api' ],
    validate: {
      query: {
        q: Joi.string().max(1000).allow('').default(''),
        field: Joi.string().max(1000).allow('').default('')
      }
    }
  },
  handler: (req, reply) => (
    req.storage.getGroups()
      .then(groups => groups.map(group => {
        const currentGroup = group;
        currentGroup.mappings = currentGroup.mappings || [];
        currentGroup.members = currentGroup.members || [];
        return currentGroup;
      }))
      .then(groups => ({
        groups: _.filter(groups, (item) => {
          // if exists, filter by search value
          const searchQuery = req.query.q;
          if (!searchQuery) return true;

          const field = req.query.field;
          return _.includes(item[field].toLowerCase(), searchQuery.toLowerCase());
        }),
        total: groups.length
      }))
      .then(groups => reply(groups))
      .catch(err => reply.error(err))
  )
});
