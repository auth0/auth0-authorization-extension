import Joi from 'joi';
import _ from 'lodash';

import { getGroupsExpanded } from '../../../lib/queries';

export default () => ({
  method: 'GET',
  path: '/api/users/{id}/groups',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the groups for a user. Add "?expand" to also load all roles and permissions for these groups.',
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
    }
  },
  handler: async (req, h) => {
    if (req.query.expand) {
      const groups = await req.storage.getGroups();
      const groupsFiltered = _.filter(groups, (group) => _.includes(group.members, req.params.id));
      const groupsExpanded = await getGroupsExpanded(req.storage, groupsFiltered);

      return h.response(groupsExpanded);
    }

    const groups = await req.storage.getGroups();
    const groupsFiltered = _.filter(groups, (group) => _.includes(group.members, req.params.id));
    const groupsMapped = groupsFiltered.map((group) => ({
      _id: group._id,
      name: group.name,
      description: group.description
    }));

    return h.response(groupsMapped);
  }
});
