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
  handler: (req, reply) => {
    reply().code(204);
  }
});
