import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../token';

describe('groups-route', () => {
  let newGroup = null;
  const groupName = 'test-group';
  const { db, server } = getServerData();
  const token = getToken();
  const guid = 'C56a418065aa426ca9455fd21deC0538';
  const group = {
    _id: guid,
    name: groupName,
    description: 'description'
  };

  before((done) => {
    db.getGroup = () => Promise.resolve(group);
    db.getGroups = () => Promise.resolve([ group ]);
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

    it('should return list of groups', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        expect(response.result[0].members).to.be.a('array');
        expect(response.result[0].name).to.be.equal(groupName);
        cb();
      });
    });

    it('should return group data', (cb) => {
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
  });

  describe('#delete', () => {
    it('should return validation error', (cb) => {
      const options = {
        method: 'DELETE',
        url: '/api/groups/invalid_id',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal('"id" must be a valid GUID');
        cb();
      });
    });

    it('should delete group', (cb) => {
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
    it('should return validation error', (cb) => {
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
    it('should return validation error', (cb) => {
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
        expect(response.result.message).to.be.equal('"name" is not allowed to be empty');
        cb();
      });
    });

    it('should update group', (cb) => {
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
