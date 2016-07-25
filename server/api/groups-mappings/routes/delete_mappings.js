import _ from 'lodash';
import Joi from 'joi';

import schema from '../schemas/mapping_ids';

module.exports = () => ({
  method: 'DELETE',
  path: '/api/groups/{id}/mappings',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    },
    description: 'Delete one or more group mappings from a group.',
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
    const mappings = req.payload;

    req.storage.getGroup(req.params.id)
      .then(group => {
        mappings.forEach(mappingId => {
          const groupMapping = _.find(group.mappings, { _id: mappingId });
          if (groupMapping) {
            group.mappings.splice(group.mappings.indexOf(groupMapping), 1);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      })
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
