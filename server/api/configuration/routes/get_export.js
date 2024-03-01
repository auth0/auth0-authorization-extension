export default () => ({
  method: 'GET',
  path: '/api/configuration/export',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:configuration' ]
    }
  },
  handler: async (req, h) => {
    if (
      !req.storage.provider ||
      !req.storage.provider.storageContext ||
      typeof req.storage.provider.storageContext.read !== 'function'
    ) {
      throw new Error('Unable to use "export" without proper storage');
    }

    const result = await req.storage.provider.storageContext.read();
    return h.response(result);
  }
});
