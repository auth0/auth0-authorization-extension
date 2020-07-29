import Promise from 'bluebird';
import { expect } from 'chai';
import * as auth0 from '../mocks/auth0';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('groups-mapping-route', () => {
  const { db, server } = getServerData();
  const guid = 'C56a418065aa426ca9455fd21deC0538';
  const mid = 'A56a418065aa426ca9455fd21deC0538';
  const connectionName = 'Username-Password-Authentication';
  const groupName = 'test-group';
  const mapping = { groupName, connectionName, _id: mid };
  const group = {
    _id: guid,
    name: groupName,
    description: 'description',
    mappings: [ mapping ]
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
        url: `/api/groups/${guid}/mappings`
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return 403 if scope is missing (list of mappings)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/mappings`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return mappings for group', (cb) => {
      const token = getToken('read:groups');
      auth0.get('/api/v2/connections', [
        { name: connectionName, id: 'cid', strategy: 'default' }
      ]);
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/mappings`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        expect(response.result).to.be.a('array');
        cb();
      });
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete mappings)', (cb) => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/mappings`,
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
        method: 'DELETE',
        url: `/api/groups/${guid}/mappings`,
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

    it('should delete mappings', (cb) => {
      let updatedGroup = null;
      const token = getToken('update:groups');
      db.updateGroup = (id, data) => {
        updatedGroup = data;
        updatedGroup._id = id;
        return Promise.resolve();
      };

      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/mappings`,
        payload: [ mid ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(204);
        expect(updatedGroup._id).to.be.equal(guid);
        expect(updatedGroup.name).to.be.equal(groupName);
        expect(updatedGroup.mappings).to.be.a('array');
        expect(updatedGroup.mappings.length).to.be.equal(0);
        cb();
      });
    });
  });

  describe('#patch', () => {
    it('should return 403 if scope is missing (update mappings)', (cb) => {
      const token = getToken();
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/mappings`,
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
        method: 'PATCH',
        url: `/api/groups/${guid}/mappings`,
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

    it('should update mappings', (cb) => {
      const token = getToken('update:groups');
      let updatedGroup = null;
      db.updateGroup = (id, data) => {
        updatedGroup = data;
        updatedGroup._id = id;
        return Promise.resolve();
      };

      const newMapping = { groupName: 'new', connectionName: 'my-connection' };
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/mappings`,
        payload: [ newMapping ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(204);
        expect(updatedGroup.name).to.be.equal(groupName);
        expect(updatedGroup._id).to.be.equal(guid);
        expect(updatedGroup.mappings).to.be.a('array');
        expect(updatedGroup.mappings[0].groupName).to.be.equal(
          newMapping.groupName
        );
        cb();
      });
    });
  });
});
