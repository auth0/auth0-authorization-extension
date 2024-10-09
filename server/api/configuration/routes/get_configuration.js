export default () => ({
  method: 'GET',
  path: '/api/configuration',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:configuration' ]
    }
  },
  handler: async (req, h) => {
    const config = await req.storage.getConfiguration();
    return h.response(config);
  }
});
