import Joi from 'joi';

import { getRolesForUser } from '../../../lib/queries';

export default () => ({
  method: 'GET',
  path: '/api/users/{id}/roles/calculate',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:roles' ]
    },
    description: 'Calculate the roles assigned to the user (including through group memberships).',
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
    }
  },
  handler: async (req, h) => {
    const roles = await getRolesForUser(req.storage, req.params.id);
    const rolesMapped = roles.map((role) => ({
      _id: role._id,
      name: role.name,
      applicationId: role.applicationId,
      description: role.description
    }));

    return h.response(rolesMapped);
  }
});
