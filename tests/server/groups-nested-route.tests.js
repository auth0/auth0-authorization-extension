import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../token';

describe.only('groups-nested-route', () => {
  const { db, server } = getServerData();
  const token = getToken();
  const guid = 'A56a418065aa426ca9455fd21deC0538';
  const ngid = 'B56a418065aa426ca9455fd21deC0538';
  const groupName = 'test-group';
  const nestedName = 'nest-group';
  const group = {
    _id: guid,
    name: groupName,
    description: 'description',
    nested: [ ngid ]
  };
  const nested = {
    _id: ngid,
    name: nestedName,
    description: 'description'
  };

  before((done) => {
    db.getGroups = () => Promise.resolve([ group, nested ]);
    db.getGroup = () => Promise.resolve(group);
    db.updateGroup = null;
    done();
  });

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/nested`
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return nested groups', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/nested`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        expect(response.result[0]._id).to.be.equal(ngid);
        expect(response.result[0].name).to.be.equal(nestedName);
        cb();
      });
    });
  });

  describe('#delete', () => {
    it('should return validation error', (cb) => {
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/nested`,
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

    it('should delete nested', (cb) => {
      let updatedGroup = null;

      db.updateGroup = (id, data) => {
        updatedGroup = data;
        updatedGroup._id = id;
        return Promise.resolve();
      };

      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/nested`,
        payload: [ ngid ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(204);
        expect(updatedGroup._id).to.be.equal(guid);
        expect(updatedGroup.name).to.be.equal(groupName);
        expect(updatedGroup.nested).to.be.a('array');
        expect(updatedGroup.nested.length).to.be.equal(0);
        cb();
      });
    });
  });

  describe('#patch', () => {
    it('should return validation error', (cb) => {
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/nested`,
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

    it('should update nested', (cb) => {
      let updatedGroup = null;
      db.updateGroup = (id, data) => {
        updatedGroup = data;
        updatedGroup._id = id;
        return Promise.resolve();
      };

      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/nested`,
        payload: [ ngid ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(204);
        expect(updatedGroup.name).to.be.equal(groupName);
        expect(updatedGroup._id).to.be.equal(guid);
        expect(updatedGroup.nested).to.be.a('array');
        expect(updatedGroup.nested[0]).to.be.equal(ngid);
        cb();
      });
    });
  });
});
