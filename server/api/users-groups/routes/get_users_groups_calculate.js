import Joi from 'joi';
import _ from 'lodash';

import { getParentGroups } from '../../../lib/queries';

export default () => ({
  method: 'GET',
  path: '/api/users/{id}/groups/calculate',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Calculate the group memberships for a user (including nested groups).',
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
    }
  },
  handler: async (req, h) => {
    const groups = await req.storage.getGroups();
    const parentGroups = await getParentGroups(groups, _.filter(groups, (group) => _.includes(group.members, req.params.id)));
    const mappedGroups = parentGroups.map((group) => ({
      _id: group._id,
      name: group.name,
      description: group.description
    }));

    return h.response(mappedGroups);
  }
});
