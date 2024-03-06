import Joi from 'joi';
import _ from 'lodash';

export default () => ({
  method: 'GET',
  path: '/api/groups/{id}/nested',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the nested groups for a group.',
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        id: Joi.string().guid().required()
      })
    }
  },
  handler: async (req, h) => {
    const groups = await req.storage.getGroups();

    const group = _.find(groups, { _id: req.params.id });
    if (!group.nested) {
      group.nested = [];
    }
    const nested = _.filter(groups, g => group.nested.indexOf(g._id) > -1);

    const sorted = _.sortByOrder(nested, [ 'name' ], [ true ]);

    return h.response(sorted);
  }
});
