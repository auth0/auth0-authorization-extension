import schema from '../schemas/hierarchy_request';
import { getGroupsHierarchy } from '../../../lib/queries';

module.exports = () => ({
  method: 'POST',
  path: '/api/groups/hierarchy',
  config: {
    auth: {
      strategies: [
        'jwt',
        'extension-secret'
      ]
    },
    description: 'Execute the authorization policy for a user in the context of a client. This will return the user\'s groups but also roles and permissions that apply to the current client.',
    tags: [ 'api' ],
    validate: {
      payload: schema
    }
  },
  handler: (req, reply) => {
    const { groups } = req.payload;

    if (req.storage.provider && req.storage.provider.storageContext && req.storage.provider.storageContext.read) {
      return getGroupsHierarchy(req.storage, groups)
        .then(data => reply(data))
        .catch(err => reply.error(err));
    }

    return reply.error(new Error('Storage error.'));
  }
});
