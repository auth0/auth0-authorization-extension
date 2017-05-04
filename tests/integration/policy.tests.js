import request from 'request-promise';
import expect from 'expect';
import faker from 'faker';
import Promise from 'bluebird';
import { getAccessToken, authzApi, token, extensionApiKey, chunks } from './utils';
import importData from './test-data.json';
import config from '../../server/lib/config';

let usersData = [];
let mgmtHeader = {};
const clientId = config('AUTH0_CLIENT_ID');

// Use Username-Password-Authentication by default.
const connectionName = 'Username-Password-Authentication';

describe('policy', () => {
  before((done) => {
    getAccessToken()
      .then(() => {
        request.post({ url: authzApi('/configuration/import'), form: {}, headers: token(), resolveWithFullResponse: true })
          .then(() => {
            // Request a Auth0 Management API token

            // Get a Management API token.
            request.post({
              uri: `https://${config('AUTH0_DOMAIN')}/oauth/token`,
              form: {
                audience: `https://${config('AUTH0_DOMAIN')}/api/v2/`,
                client_id: config('AUTH0_CLIENT_ID'),
                client_secret: config('AUTH0_CLIENT_SECRET'),
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
                  url: `https://${config('AUTH0_DOMAIN')}/api/v2/users`,
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
          }, done);
      })
      .catch(done);
  });

  /**
   * Delete all the just created test users after the tests.
   */
  after((done) => {
    const userDeletions = usersData.map((user) => request.delete({
      url: `https://${config('AUTH0_DOMAIN')}/api/v2/users/${user.user_id}`,
      headers: mgmtHeader,
      resolveWithFullResponse: true
    }));

    Promise.all(userDeletions)
      .then(() => {
        done();
      }, done);
  });

  /**
   * Given this group:
   * {
   *   name: "Internal Talks",
   *   mappings: [ { name: "Auth0 Employees", connection: "Some-Connection" } ]
   * }
   * If I request the groups for "Auth0 Employees"
   * and connection "Some-Connection", I should get "Internal Talks".
   */
  it('should get the right mapping group/s with the connection name and the groups', (done) => {
    const user = usersData[0];

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

  it('shouldn\'t get the right mapping group/s with the wrong connection name and the groups', (done) => {
    // User #4 is a member of the group 'Development'
    const user = usersData[4];

    request.post({
      url: authzApi(`/users/${user.id}/policy/${clientId}`),
      headers: { ...token(), 'x-api-key': extensionApiKey },
      json: true,
      body: {
        connectionName,
        groups: [ 'Development' ]
      }
    })
    .then((policy) => {
      expect(policy.groups).toNotContain('Internal Talks');
      done();
    });
  });
});
