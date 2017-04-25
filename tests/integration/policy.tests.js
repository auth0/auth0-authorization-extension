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

    // Splits an array into chunked sub-arrays.
    const chunks = (array, size) => {
      const items = [ ...array ];
      const results = [];
      while (items.length) {
        results.push(items.splice(0, size));
      }
      return results;
    };

    // Get a Management API token.
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

        // Use Username-Password-Authentication by default.
        const connectionName = 'Username-Password-Authentication';

        // Create 10 dummy users locally.
        usersData = [ ...new Array(10) ].map(() => ({
          connection: connectionName,
          email: faker.internet.email(),
          password: faker.internet.password()
        }));

        // Actually create the users in the server.
        const userCreationRequests = usersData.map((user) => request.post({
          url: `https://${config('INT_AUTH0_DOMAIN')}/api/v2/users`,
          body: user,
          headers: mgmtHeader,
          json: true
        }));

        Promise.all(userCreationRequests)
          .then((values) => {
            usersData = values;
    
            // Build the 'provider|id' user identifier for the extension members arrays.
            const userIds = chunks(
              usersData.map(
                (user) => (`${user.identities[0].provider}|${user.identities[0].user_id}`)
              ), 2
            );

            importData.groups = importData.groups.map((originGroup, i) => {
              const group = { ...originGroup };
              group.members = userIds[i];
              return group;
            });

            // Import data to the extension
            request.post({
              url: authzApi('/configuration/import'),
              body: importData,
              headers: token(),
              json: true,
              resolveWithFullResponse: true
            })
            .then(() => {
              // At this point, we are able to actually test.

            }, done);
          }, done);
      }, done);

    // request.get({ url: authzApi('/policy'), headers: token(), json: true })
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
