import Joi from 'joi';

import { getRolesForUser } from '../../../lib/queries';

module.exports = () => ({
  method: 'GET',
  path: '/api/users/{id}/roles/calculate',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:roles' ]
    },
    description: 'Calculate the roles assigned to the user (including through group memberships).',
    tags: [ 'api' ],
    validate: {
      params: {
        id: Joi.string().required()
      }
    }
  },
  handler: (req, reply) =>
    getRolesForUser(req.storage, req.params.id)
      .then(roles => reply(roles))
      .catch(err => reply.error(err))
});
