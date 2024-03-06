import _ from 'lodash';
import Joi from 'joi';

import schema from '../schemas/mapping_ids';

export default () => ({
  method: 'DELETE',
  path: '/api/groups/{id}/mappings',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Delete one or more group mappings from a group.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      params: Joi.object({
        id: Joi.string().guid().required()
      }),
      payload: schema
    }
  },
  handler: async (req, h) => {
    const mappings = req.payload;

    const group = await req.storage.getGroup(req.params.id);

    mappings.forEach(mappingId => {
      const groupMapping = _.find(group.mappings, { _id: mappingId });
      if (groupMapping) {
        group.mappings.splice(group.mappings.indexOf(groupMapping), 1);
      }
    });

    await req.storage.updateGroup(req.params.id, group);

    return h.response.code(204);
  }
});
