import ApiAccess from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'POST',
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

    return apiAccess.createApi()
      .then(api => reply(api))
      .catch(err => reply.error(err));
  }
});
