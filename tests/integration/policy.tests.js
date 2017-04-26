import request from 'request-promise';
import expect from 'expect';
import faker from 'faker';
import { getAccessToken, authzApi, token, credentials, extensionApiKey } from './utils';
import importData from './test-data.json';
import config from '../../server/lib/config';
import Promise from 'bluebird';

let accessToken;
let usersData = [];
let mgmtHeader = {};

// Use Username-Password-Authentication by default.
const connectionName = 'Username-Password-Authentication';

describe('policy', () => {
  before((done) => {
    getAccessToken()
      .then(response => {
        accessToken = response;
        request.post({ url: authzApi('/configuration/import'), form: {}, headers: token(), resolveWithFullResponse: true })
          .then(() => {
            // Request a Auth0 Management API token

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
                mgmtHeader = { Authorization: `Bearer ${mgmtToken}` };

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
                    const userIds = chunks(usersData.map(user => user.user_id), 2);

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
                      done();
                    }, done);
                  }, done);
              }, done);
          });
      })
      .catch(done);
  });

  /**
   * Delete all the just created test users after the tests.
   */
  after((done) => {
    const userDeletions = usersData.map((user) => request.delete({
      url: `https://${config('INT_AUTH0_DOMAIN')}/api/v2/users/${user.user_id}`,
      headers: mgmtHeader,
      resolveWithFullResponse: true
    }));

    Promise.all(userDeletions)
      .then(() => {
        done();
      }, done);
  });

  it('should get the mappings parents of an user with a connection', (done) => {
    /**
     * Given this group:
     * {
     *   name: "Internal Talks",
     *   mappings: [ { name: "Auth0 Employees", connection: "Some-Connection" } ]
     * }
     * If I request the groups for "Auth0 Employees"
     * and connection "Some-Connection", I should get "Internal Talks".
     */

    const user = usersData[0];
    const clientId = '4UfTcIbcCzdvUokuwI8Yp9cRGl70mo37';

    request.post({
      url: authzApi(`/users/${user.id}/policy/${clientId}`),
      headers: { ...token(), 'x-api-key': extensionApiKey },
      json: true,
      body: {
        connectionName,
        groups: [ 'Auth0 Employees' ]
      }
    })
    .then((policy) => {
      expect(policy.groups).toContain('Internal Talks');
      done();
    });
  });
});
