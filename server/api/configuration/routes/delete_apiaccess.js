import ApiAccess from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'DELETE',
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

    return apiAccess.deleteApi()
      .then(() => reply())
      .catch(err => reply.error(err));
  }
});
