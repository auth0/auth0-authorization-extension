import Joi from 'joi';
import _ from 'lodash';

module.exports = () => ({
  method: 'GET',
  path: '/api/groups/{id}/nested',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the nested groups for a group.',
    tags: [ 'api' ],
    validate: {
      params: {
        id: Joi.string().guid().required()
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getGroups()
      .then((groups) => {
        const group = _.find(groups, { _id: req.params.id });
        if (!group.nested) {
          group.nested = [];
        }
        return _.filter(groups, g => group.nested.indexOf(g._id) > -1);
      })
      .then(nested => _.sortByOrder(nested, [ 'name' ], [ true ]))
      .then(nested => reply(nested))
      .catch(err => reply.error(err))
});
