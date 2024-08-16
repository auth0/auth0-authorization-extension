import superagent from 'superagent';
import expect from 'expect';
import { faker } from '@faker-js/faker';
import Promise from 'bluebird';
import {
  getAccessToken,
  authzApi,
  token,
  extensionApiKey,
  chunks
} from './utils';
import importData from './test-data.json';
import config from '../../server/lib/config';

let accessToken = null;
let usersData = [];
let mgmtHeader = {};
const clientId = config('AUTH0_CLIENT_ID');

// Use Username-Password-Authentication by default.
const connectionName = 'Username-Password-Authentication';

describe('policy', () => {
  before(async () => {
    try {
      accessToken = await getAccessToken();

      await superagent
        .post(authzApi('/configuration/import'))
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      const mgmtTokenResponse = await superagent
        .post(`https://${config('AUTH0_DOMAIN')}/oauth/token`)
        .send({
          audience: `https://${config('AUTH0_DOMAIN')}/api/v2/`,
          client_id: config('AUTH0_CLIENT_ID'),
          client_secret: config('AUTH0_CLIENT_SECRET'),
          grant_type: 'client_credentials'
        });

      const mgmtToken = mgmtTokenResponse.body.access_token;
      mgmtHeader = { Authorization: `Bearer ${mgmtToken}` };

      // Create 5 dummy users locally.
      usersData = [ ...new Array(5) ].map(() => ({
        connection: connectionName,
        email: faker.internet.email(),
        password: faker.internet.password()
      }));

      // Actually create the users in the server.
      const userCreationRequests = usersData.map((user) =>
        superagent
          .post(`https://${config('AUTH0_DOMAIN')}/api/v2/users`)
          .set(mgmtHeader)
          .send(user)
      );

      const createdUsers = await Promise.all(userCreationRequests);

      usersData = createdUsers.map((res) => res.body);

      // Build the 'provider|id' user identifier for the extension members arrays.
      const userIds = chunks(
        usersData.map((user) => user.user_id),
        2
      );

      importData.groups = importData.groups.map((originGroup, i) => {
        const group = { ...originGroup };
        group.members = userIds[i];
        return group;
      });

      // Import data to the extension
      await superagent
          .post(authzApi('/configuration/import'))
          .set('Authorization', `Bearer ${accessToken}`)
        .send(importData);
    } catch (error) {
      throw new Error(error);
    }
  });

  /**
   * Delete all the just created test users after the tests.
   */
  after(async () => {
    try {
      const userDeletions = usersData.map((user) =>
        superagent
          .delete(`https://${config('AUTH0_DOMAIN')}/api/v2/users/${user.user_id}`)
          .set(mgmtHeader)
      );

      await Promise.all(userDeletions);
    } catch (error) {
      throw new Error(error);
    }
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
  it('should get the right mapping group/s with the connection name and the groups', async () => {
    const user = usersData[0];

    const policyResponse = await superagent
      .post(authzApi(`/users/${user.id}/policy/${clientId}`))
      .set({ ...token(accessToken), 'x-api-key': extensionApiKey })
      .send({
        connectionName,
        groups: [ 'Auth0 Employees' ]
      });

    expect(policyResponse.body.groups).toContain('Internal Talks');
  });

  it("shouldn't get the right mapping group/s with the wrong connection name and the groups", async () => {
    // User #4 is a member of the group 'Development'
    const user = usersData[4];

    const policyResponse = await superagent
      .post(authzApi(`/users/${user.id}/policy/${clientId}`))
      .set({ ...token(accessToken), 'x-api-key': extensionApiKey })
      .send({
        connectionName,
        groups: [ 'Development' ]
      });

    expect(policyResponse.body.groups).not.toContain('Internal Talks');
  });
});
