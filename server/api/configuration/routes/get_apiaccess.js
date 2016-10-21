import ApiAccess from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'GET',
  path: '/api/configuration/apiaccess',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    }
  },
  handler: (req, reply) => {
    const apiAccess = new ApiAccess();

    apiAccess.getApi(true)
      .then((api) => reply({ enabled: !!api.identifier, ...api }))
      .catch(err => reply.error(err));
  }
});
