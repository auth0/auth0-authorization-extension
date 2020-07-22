import Promise from 'bluebird';
import { expect } from 'chai';
import uuid from 'node-uuid';

import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('groups-route', () => {
  let newGroup = null;
  const groupName = 'developers';
  const { db, server } = getServerData();
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

  before((done) => {
    db.getGroup = () => Promise.resolve(group);
    db.getGroups = () => Promise.resolve(groups);
    db.getRoles = () => Promise.resolve(roles);
    db.getPermissions = () => Promise.resolve(permissions);
    db.hash = uuid.v4();
    db.updateGroup = null;
    done();
  });

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/groups'
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return 403 if scope is missing (list of groups)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return list of groups', (cb) => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.total).to.be.equal(3);
        expect(response.result.groups).to.be.a('array');
        expect(response.result.groups[0].members).to.be.a('array');
        expect(response.result.groups[0].name).to.be.equal('employees');
        cb();
      });
    });

    it('should return 403 if scope is missing (single groups)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return group data', (cb) => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('object');
        expect(response.result._id).to.be.equal(guid);
        expect(response.result.name).to.be.equal(groupName);
        cb();
      });
    });

    it('should return expanded group data', (cb) => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}?expand=true`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
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
        cb();
      });
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete group)', (cb) => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return validation error', (cb) => {
      const token = getToken('delete:groups');
      const options = {
        method: 'DELETE',
        url: '/api/groups/invalid_id',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal(
          '"id" must be a valid GUID'
        );
        cb();
      });
    });

    it('should delete group', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(204);
        expect(removedId).to.be.equal(guid);
        cb();
      });
    });
  });

  describe('#post', () => {
    it('should return 403 if scope is missing (create group)', (cb) => {
      const token = getToken();
      const options = {
        method: 'POST',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return validation error', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal('"name" is required');
        cb();
      });
    });

    it('should create group', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        expect(newGroup.name).to.be.equal(groupName);
        cb();
      });
    });
  });

  describe('#put', () => {
    it('should return 403 if scope is missing (update group)', (cb) => {
      const token = getToken();
      const options = {
        method: 'PUT',
        url: `/api/groups/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return validation error', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal(
          '"name" is not allowed to be empty'
        );
        cb();
      });
    });

    it('should update group', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        expect(newGroup.name).to.be.equal(updatedName);
        expect(newGroup.id).to.be.equal(guid);
        cb();
      });
    });
  });
});
