import nock from 'nock';

module.exports.get = (route, data, code = 200, times = 1) =>
   nock('https://foo.auth0.local')
    .get(route)
    .query(() => true)
    .times(times)
    .reply(code, data);

module.exports.put = (route, times = 1) =>
  nock('https://foo.auth0.local')
    .intercept(route, 'PUT')
    .times(times)
    .reply(204);

module.exports.patch = (route, times = 1) =>
  nock('https://foo.auth0.local')
    .intercept(route, 'PATCH')
    .times(times)
    .reply(204);

module.exports.delete = (route, times = 1) =>
  nock('https://foo.auth0.local')
    .intercept(route, 'DELETE')
    .times(times)
    .reply(204);

module.exports.post = (route, times = 1) =>
  nock('https://foo.auth0.local')
    .post(route)
    .times(times)
    .reply(204);

module.exports.auth0Client = () =>
  nock('https://foo.auth0.local')
    .post('/oauth/token')
    .times(5)
    .reply(200, { access_token: 'access_token', id_token: 'id_token', ok: true });
