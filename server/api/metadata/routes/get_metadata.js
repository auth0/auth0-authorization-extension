import metadata from '../../../../webtask.json';

export default () => ({
  method: 'GET',
  path: '/meta',
  options: {
    auth: false
  },
  handler: async (req, h) => h.response(metadata)
});
