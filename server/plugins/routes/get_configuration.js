module.exports = () => ({
  method: 'GET',
  path: '/configuration',
  config: {
    auth: false
  },
  handler: (req, reply) =>
    req.storage.getConfiguration()
      .then(config => reply(config))
      .catch(err => reply.error(err))
});
