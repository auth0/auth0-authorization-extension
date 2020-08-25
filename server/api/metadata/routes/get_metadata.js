import metadata from '../../../../webtask.json';

export default () => ({
  method: 'GET',
  path: '/meta',
  config: {
    auth: false
  },
  handler: (request, reply) => reply(metadata)
});
