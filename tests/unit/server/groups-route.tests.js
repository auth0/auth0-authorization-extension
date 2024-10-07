import { expect } from 'chai';
import uuid from 'node-uuid';

import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('groups-route', async () => {
  let server = null;
  let db = null;

  let newGroup = null;
  const groupName = 'developers';
  const guid = 'C56a418065aa426ca9455fd21deC1112';
  const group = {
    _id: guid,
    name: groupName,
    description: 'description'
  };

  const groups = [
    {
      _id: 'C56a418065aa426ca9455fd21deC1110',
      name: 'employees',
      roles: [ 'r1', 'r2' ],
      nested: [ 'C56a418065aa426ca9455fd21deC1111' ]
    },
    {
      _id: 'C56a418065aa426ca9455fd21deC1111',
      name: 'it',
      roles: [ 'r3' ],
      nested: [ guid ]
    },
    { _id: guid, name: groupName, roles: [ 'r1' ], nested: [ '', '' ] }
  ];

  const roles = [
    {
      _id: 'r1',
      name: 'Role 1',
      applicationId: 'app1',
      applicationType: 'client',
      permissions: [ 'p11' ]
    },
    {
      _id: 'r2',
      name: 'Role 2',
      applicationId: 'app2',
      applicationType: 'client',
      permissions: [ 'p21', 'p22', 'p33' ]
    }
  ];
  const permissions = [
    {
      _id: 'p11',
      name: 'Permission 11',
      applicationId: 'app1',
      applicationType: 'client'
    },
    {
      _id: 'p12',
      name: 'Permission 12',
      applicationId: 'app1',
      applicationType: 'client'
    },
    {
      _id: 'p21',
      name: 'Permission 21',
      applicationId: 'app2',
      applicationType: 'client'
    },
    {
      _id: 'p22',
      name: 'Permission 22',
      applicationId: 'app2',
      applicationType: 'client'
    }
  ];

  before(async () => {
    const result = await getServerData();
    server = result.server;
    db = result.db;
    db.getGroup = () => Promise.resolve(group);
    db.getGroups = () => Promise.resolve(groups);
    db.getRoles = () => Promise.resolve(roles);
    db.getPermissions = () => Promise.resolve(permissions);
    db.hash = uuid.v4();
    db.updateGroup = null;
  });

  describe('#get', () => {
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: '/api/groups'
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (list of groups)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return list of groups', async () => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.total).to.be.equal(3);
      expect(response.result.groups).to.be.a('array');
      expect(response.result.groups[0].members).to.be.a('array');
      expect(response.result.groups[0].name).to.be.equal('employees');
    });

    it('should return 403 if scope is missing (single groups)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return group data', async () => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('object');
      expect(response.result._id).to.be.equal(guid);
      expect(response.result.name).to.be.equal(groupName);
    });

    it('should return expanded group data', async () => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}?expand=true`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('object');
      expect(response.result._id).to.be.equal(guid);
      expect(response.result.name).to.be.equal(groupName);
      expect(response.result.roles).to.be.a('array');
      expect(response.result.roles.length).to.equal(2);
      expect(response.result.roles[0]).to.be.a('object');
      expect(response.result.roles[0]._id).to.equal('r1');
      expect(response.result.roles[1]._id).to.equal('r2');
      expect(response.result.roles[0].permissions).to.be.a('array');
      expect(response.result.roles[0].permissions[0]).to.be.a('object');
      expect(response.result.roles[0].permissions.length).to.equal(1);
      expect(response.result.roles[1].permissions.length).to.equal(2);
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete group)', async () => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return validation error', async () => {
      const token = getToken('delete:groups');
      const options = {
        method: 'DELETE',
        url: '/api/groups/invalid_id',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.message).to.be.equal(
        '"id" must be a valid GUID'
      );
    });

    it('should delete group', async () => {
      const token = getToken('delete:groups');
      let removedId = null;
      db.deleteGroup = (id) => {
        removedId = id;
        return Promise.resolve();
      };

      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(204);
      expect(removedId).to.be.equal(guid);
    });
  });

  describe('#post', () => {
    it('should return 403 if scope is missing (create group)', async () => {
      const token = getToken();
      const options = {
        method: 'POST',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return validation error', async () => {
      const token = getToken('create:groups');
      const options = {
        method: 'POST',
        url: '/api/groups',
        payload: {
          description: 'description'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.message).to.be.equal('"name" is required');
    });

    it('should create group', async () => {
      const token = getToken('create:groups');
      db.createGroup = (data) => {
        newGroup = data;
        return Promise.resolve();
      };

      const options = {
        method: 'POST',
        url: '/api/groups',
        payload: {
          name: groupName,
          description: 'description'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(200);
      expect(newGroup.name).to.be.equal(groupName);
    });
  });

  describe('#put', () => {
    it('should return 403 if scope is missing (update group)', async () => {
      const token = getToken();
      const options = {
        method: 'PUT',
        url: `/api/groups/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return validation error', async () => {
      const token = getToken('update:groups');
      const options = {
        method: 'PUT',
        url: `/api/groups/${guid}`,
        payload: {
          name: '',
          description: 'description'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.message).to.be.equal(
        '"name" is not allowed to be empty'
      );
    });

    it('should update group', async () => {
      const token = getToken('update:groups');
      db.updateGroup = (id, data) => {
        newGroup = data;
        newGroup.id = id;
        return Promise.resolve();
      };

      const updatedName = 'updated-group';
      const options = {
        method: 'PUT',
        url: `/api/groups/${guid}`,
        payload: {
          name: updatedName,
          description: 'description'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(200);
      expect(newGroup.name).to.be.equal(updatedName);
      expect(newGroup.id).to.be.equal(guid);
    });
  });
});
