import metadata from '../../../../webtask.json';

module.exports = () => ({
  method: 'GET',
  path: '/meta',
  config: {
    auth: false
  },
  handler: (request, reply) => reply(metadata)
});
