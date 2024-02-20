export default (server) => ({
  method: 'PUT',
  path: '/.extensions/on-update',
  config: {
    auth: false,
    pre: [
      server.handlers.validateHookToken('/.extensions/on-update'),
      server.handlers.managementClient
    ]
  },
  handler: async (req, h) => h.response.code(204)
});
