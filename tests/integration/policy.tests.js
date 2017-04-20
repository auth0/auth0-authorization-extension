import request from 'request-promise';
import expect from 'expect';
import faker from 'faker';
import { getAccessToken, authzApi, token, credentials } from './utils';

let accessToken;

describe('groups', () => {
  before((done) => {
    getAccessToken()
      .then(response => {
        accessToken = response;
        request.post({ url: authzApi('/configuration/import'), form: {}, headers: token(), resolveWithFullResponse: true })
          .then(() => done());
      })
      .catch(err => done(err));
  });

  it('should get the groups, permissions and roles of an user', (done) => {
    request.get({ url: authzApi('/users'), headers: token(), json: true })
      .then((response) => {
        const users = response.users;
        const user = users[0];
        const clientId = credentials.client_id;
        const connectionName = user.identities[0].connection;

        request.post({
          url: authzApi(`/users/${user.id}/policy/${clientId}`),
          headers: token(),
          json: true,
          body: {
            connectionName,
            groups: []
          }
        })
          .then((policy) => {
            done();
          })
          .catch(done);

      })
      .catch(done);
  });
});

