import request from 'request-promise';
import expect from 'expect';
import faker from 'faker';
import { getAccessToken, authzApi, token, credentials } from './utils';
import importData from './test-data.json';
import config from '../../server/lib/config';
import Promise from 'bluebird';

let accessToken;

describe('policy', () => {
  before((done) => {
    getAccessToken()
      .then(response => {
        accessToken = response;
        request.post({ url: authzApi('/configuration/import'), form: {}, headers: token(), resolveWithFullResponse: true })
          .then(() => done());
      })
      .catch(err => done(err));
  });

  it('should get the groups, permissions and roles of an user',  (done) => {
    // Request a Auth0 Management API token
    let usersData = [];

    request.post({
      uri: `https://${config('INT_AUTH0_DOMAIN')}/oauth/token`,
      form: {
        audience: `https://${config('INT_AUTH0_DOMAIN')}/api/v2/`,
        client_id: config('INT_AUTH0_CLIENT_ID'),
        client_secret: config('INT_AUTH0_CLIENT_SECRET'),
        grant_type: 'client_credentials'
      },
      json: true
    })
      .then(res => res.access_token).then((mgmtToken) => {
        const mgmtHeader = { Authorization: `Bearer ${mgmtToken}` };
        
        // Import data to the extension
        request.post({
          url: authzApi('/configuration/import'),
          body: importData,
          headers: token(),
          json: true,
          resolveWithFullResponse: true
        })
        .then(() => {
          const connectionName = 'Username-Password-Authentication';

          usersData = [ ...new Array(10) ].map(() => ({
            connection: connectionName,
            email: faker.internet.email(),
            username: faker.internet.userName(),
            password: faker.internet.password()
          }));

          const userCreationRequests = usersData.map((user) => request.post({
            url: `https://${config('INT_AUTH0_DOMAIN')}/api/v2/users`,
            body: user,
            headers: mgmtHeader,
            json: true
          }));

          Promise.all(userCreationRequests)
            .then((values) => {
              usersData = values;


            })
            .catch((errors) => console.log(errors));
        }).catch(console.log);
      }).catch(done);

    // request.get({ url: authzApi('/users'), headers: token(), json: true })
    //   .then((response) => {
    //     const users = response.users;
    //     const user = users[0];
    //     const clientId = credentials.client_id;
    //     const connectionName = user.identities[0].connection;

    //     request.post({
    //       url: authzApi(`/users/${user.id}/policy/${clientId}`),
    //       headers: token(),
    //       json: true,
    //       body: {
    //         connectionName,
    //         groups: []
    //       }
    //     })
    //     .then((policy) => {
    //       done();
    //     });
    //   }).catch(done);
  });
});
