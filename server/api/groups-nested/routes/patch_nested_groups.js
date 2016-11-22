import Joi from 'joi';

import schema from '../schemas/group_ids';

module.exports = () => ({
  method: 'PATCH',
  path: '/api/groups/{id}/nested',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Add one or more nested groups in a group.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      params: {
        id: Joi.string().guid().required()
      },
      payload: schema
    }
  },
  handler: (req, reply) => {
    const nested = req.payload;

    req.storage.getGroup(req.params.id)
      .then(group => {
        if (!group.nested) {
          group.nested = [];
        }

        nested.forEach(nestedGroupId => {
          if (group.nested.indexOf(nestedGroupId) === -1 && nestedGroupId !== req.params.id) {
            group.nested.push(nestedGroupId);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      })
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
