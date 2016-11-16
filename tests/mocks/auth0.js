import nock from 'nock';

module.exports.get = (route, data, code = 200) =>
   nock('https://foo.auth0.local')
    .get(route)
    .query(() => true)
    .reply(code, data);

module.exports.patch = (route) =>
  nock('https://foo.auth0.local')
    .intercept(route, 'PATCH')
    .reply(204);

module.exports.delete = (route) =>
  nock('https://foo.auth0.local')
    .intercept(route, 'DELETE')
    .reply(204);

module.exports.post = (route) =>
  nock('https://foo.auth0.local')
    .post(route)
    .reply(204);

module.exports.auth0Client = () =>
  nock('https://foo.auth0.local')
    .post('/oauth/token')
    .times(2)
    .reply(200, { access_token: 'access_token', id_token: 'id_token', ok: true });
