import _ from 'lodash';
import Joi from 'joi';

export default () => ({
  method: 'GET',
  path: '/api/groups',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get all groups in the system.',
    tags: [ 'api' ],
    validate: {
      query: Joi.object({
        q: Joi.string().max(1000).allow('').default(''),
        field: Joi.string().max(1000).allow('').default('')
      })
    }
  },
  handler: async (req, h) => {
    const groups = await req.storage.getGroups();
    const groupsMapped = groups.map(group => {
      const currentGroup = group;
      currentGroup.mappings = currentGroup.mappings || [];
      currentGroup.members = currentGroup.members || [];
      return currentGroup;
    });

    const result = {
      groups: _.filter(groupsMapped, (item) => {
        // if exists, filter by search value
        const searchQuery = req.query.q;
        if (!searchQuery) return true;

        const field = req.query.field;
        return _.includes(item[field].toLowerCase(), searchQuery.toLowerCase());
      }),
      total: groupsMapped.length
    };

    return h.response(result);
  }
});
