import { expect } from 'chai';
import uuid from 'node-uuid';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('users-groups-route', async () => {
  let server = null;
  let db = null;

  let group = null;
  const groupName = 'developers';
  const guid = 'C56a418065aa426ca9455fd21deC1112';

  const groups = [
    { _id: 'C56a418065aa426ca9455fd21deC1110', name: 'employees', roles: [ 'r1', 'r2' ], nested: [ 'C56a418065aa426ca9455fd21deC1111' ] },
    { _id: 'C56a418065aa426ca9455fd21deC1111', name: 'it', roles: [ 'r3' ], nested: [ guid ] },
    { _id: guid, name: groupName, roles: [ 'r1' ], nested: [ '', '' ], members: [ 'userId' ] },
    { _id: 'C56a418065aa426ca9455fd21deC1114', name: 'group 4', roles: [ 'r3' ] },
    { _id: 'C56a418065aa426ca9455fd21deC1115', name: 'group 5', roles: [ 'r4' ] }
  ];

  const roles = [
    { _id: 'r1', name: 'Role 1', applicationId: 'app1', applicationType: 'client', permissions: [ 'p11' ] },
    { _id: 'r2', name: 'Role 2', applicationId: 'app2', applicationType: 'client', permissions: [ 'p21', 'p22', 'p33' ] },
    { _id: 'r3', name: 'Role 3', applicationId: 'app1', applicationType: 'client', permissions: [ 'p44' ] },
    { _id: 'r4', name: 'Role 3', applicationId: 'app1', applicationType: 'client', permissions: [ 'p55' ] }
  ];
  const permissions = [
    { _id: 'p11', name: 'Permission 11', applicationId: 'app1', applicationType: 'client' },
    { _id: 'p12', name: 'Permission 12', applicationId: 'app1', applicationType: 'client' },
    { _id: 'p21', name: 'Permission 21', applicationId: 'app2', applicationType: 'client' },
    { _id: 'p22', name: 'Permission 22', applicationId: 'app2', applicationType: 'client' },
    { _id: 'p44', name: 'Permission 44', applicationId: 'app2', applicationType: 'client' },
    { _id: 'p55', name: 'Permission 55', applicationId: 'app2', applicationType: 'client' }
  ];

  before(async () => {
    const result = await getServerData();
    server = result.server;
    db = result.db;
    group = {
      _id: guid,
      name: groupName,
      description: 'description',
      members: [ 'userId' ]
    };
    db.hash = uuid.v4();
    db.getGroups = () => Promise.resolve(groups);
    db.getGroup = () => Promise.resolve(group);
    db.getRoles = () => Promise.resolve(roles);
    db.getPermissions = () => Promise.resolve(permissions);
    db.updateGroup = (id, data) => {
      group.id = id;
      group.members = data.members;
      return Promise.resolve();
    };
  });

  describe('#get', () => {
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: '/api/users/userId/groups'
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (list of groups)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/users/userId/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return user groups', async () => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: '/api/users/userId/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('array');
      expect(response.result[0]._id).to.be.equal(group._id);
      expect(response.result[0].name).to.be.equal(group.name);
    });

    it('should return user groups on expand', async () => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: '/api/users/userId/groups?expand=true',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.groups).to.be.a('array');
      expect(response.result.groups.length).to.be.equal(3);
      expect(response.result.groups[0].name).to.be.equal('employees');
      expect(response.result.groups[1].name).to.be.equal('it');
      expect(response.result.groups[2].name).to.be.equal('developers');
      expect(response.result.roles[0]._id).to.be.equal('r1');
      expect(response.result.roles[1]._id).to.be.equal('r2');
      expect(response.result.roles[0].permissions.length).to.be.equal(1);
      expect(response.result.roles[0].permissions[0]._id).to.be.equal('p11');
    });

    it('should return empty array', async () => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: '/api/users/test-auth|no-such-user/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('array');
      expect(response.result.length).to.be.equal(0);
    });

    it('should return 403 if scope is missing (list of calculated groups)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/users/userId/groups/calculate',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return calculated groups', async () => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: '/api/users/userId/groups/calculate',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('array');
      expect(response.result[0].name).to.be.equal('employees');
      expect(response.result[1].name).to.be.equal('it');
      expect(response.result[2].name).to.be.equal('developers');
    });
  });

  describe('#patch', () => {
    beforeEach(() => {
      group.members = null;
    });

    it('should return 403 if scope is missing (update groups)', async () => {
      const token = getToken();
      const options = {
        method: 'PATCH',
        url: '/api/users/userId/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should add user to groups', async () => {
      const token = getToken('update:groups');
      const options = {
        method: 'PATCH',
        url: '/api/users/userId/groups',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: [ group._id ]
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.equal(204);
      expect(group.id).to.be.equal(group._id);
      expect(group.members[0]).to.be.equal('userId');
    });

    it('should add user to groups by name', async () => {
      const token = getToken('update:groups');
      const options = {
        method: 'PATCH',
        url: '/api/users/userId/groups',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: [ group.name ]
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.equal(204);
      expect(group.id).to.be.equal(group._id);
      expect(group.members[0]).to.be.equal('userId');
    });
  });
});
