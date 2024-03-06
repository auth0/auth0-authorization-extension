import _ from 'lodash';
import Joi from 'joi';

import { getParentGroups, getRolesForGroups } from '../../../lib/queries';

export default (server) => ({
  method: 'GET',
  path: '/api/groups/{id}/roles/nested',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the nested roles for a group.',
    tags: [ 'api' ],
    pre: [
      server.handlers.managementClient
    ],
    validate: {
      params: Joi.object({
        id: Joi.string().guid().required()
      })
    }
  },
  handler: async (req, h) => {
    const groups = await req.storage.getGroups();

    const group = _.find(groups, { _id: req.params.id });
    const parentGroups = await getParentGroups(groups, [ group ]);

    const roles = await req.storage.getRoles();
    const rolesForGroups = getRolesForGroups(parentGroups, roles);

    return h.response(rolesForGroups);
  }
});
