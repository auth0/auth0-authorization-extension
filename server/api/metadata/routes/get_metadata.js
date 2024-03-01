import metadata from '../../../../webtask.json';

export default () => ({
  method: 'GET',
  path: '/meta',
  options: {
    auth: false
  },
  handler: (request, reply) => reply(metadata)
});
