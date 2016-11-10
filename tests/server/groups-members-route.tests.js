import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('groups-members-route', () => {
  const { db, server } = getServerData();
  const token = getToken();
  const guid = 'C56a418065aa426ca9455fd21deC0538';
  const uid = 'auth0|some_user_id';
  const groupName = 'test-group';
  const group = {
    _id: guid,
    name: groupName,
    description: 'description',
    members: []
  };

  before((done) => {
    db.getGroup = () => Promise.resolve(group);
    db.updateGroup = null;
    done();
  });

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/members`
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return members', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/members`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        expect(response.result.users).to.be.a('array');
        expect(response.result.total).to.be.a('number');
        cb();
      });
    });

    it('should return nested members', (cb) => {
      db.getGroups = () => Promise.resolve([ group ]);
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/members/nested`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        expect(response.result.nested).to.be.a('array');
        expect(response.result.total).to.be.a('number');
        cb();
      });
    });
  });

  describe('#delete', () => {
    it('should return validation error', (cb) => {
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/members`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal('"value" must be an array');
        cb();
      });
    });

    it('should delete members', (cb) => {
      let updatedGroup = null;

      db.updateGroup = (id, data) => {
        updatedGroup = data;
        updatedGroup._id = id;
        return Promise.resolve();
      };

      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/members`,
        payload: [ uid ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(204);
        expect(updatedGroup._id).to.be.equal(guid);
        expect(updatedGroup.name).to.be.equal(groupName);
        expect(updatedGroup.members).to.be.a('array');
        expect(updatedGroup.members.length).to.be.equal(0);
        cb();
      });
    });
  });

  describe('#patch', () => {
    it('should return validation error', (cb) => {
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/members`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal('"value" must be an array');
        cb();
      });
    });

    it('should update members', (cb) => {
      let updatedGroup = null;
      db.updateGroup = (id, data) => {
        updatedGroup = data;
        updatedGroup._id = id;
        return Promise.resolve();
      };

      const newMember = 'auth0|some_new_user_id';
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/members`,
        payload: [ newMember ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(204);
        expect(updatedGroup.name).to.be.equal(groupName);
        expect(updatedGroup._id).to.be.equal(guid);
        expect(updatedGroup.members).to.be.a('array');
        expect(updatedGroup.members[0]).to.be.equal(newMember);
        cb();
      });
    });
  });
});
