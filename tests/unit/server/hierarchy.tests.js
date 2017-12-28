import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('users-route', () => {
  const { db, server } = getServerData();
  const token = getToken();
  const clientId = 'client_id';
  const permissions = [
    {
      _id: 'A76a418065aa426ca9455fd21deC0538',
      name: 'read',
      applicationId: clientId
    },
    {
      _id: 'B76a418065aa426ca9455fd21deC0538',
      name: 'update',
      applicationId: clientId
    },
    {
      _id: 'C76a418065aa426ca9455fd21deC0538',
      name: 'create',
      applicationId: clientId
    },
    {
      _id: 'D76a418065aa426ca9455fd21deC0538',
      name: 'comment',
      applicationId: clientId
    },
    {
      _id: 'E76a418065aa426ca9455fd21deC0538',
      name: 'delete',
      applicationId: `${clientId}_2`
    }
  ];
  const roles = [
    {
      _id: 'A66a418065aa426ca9455fd21deC0538',
      name: 'read-role',
      applicationId: clientId,
      permissions: [ permissions[0]._id ]
    },
    {
      _id: 'B66a418065aa426ca9455fd21deC0538',
      name: 'update-role',
      applicationId: clientId,
      permissions: [ permissions[1]._id ]
    },
    {
      _id: 'C66a418065aa426ca9455fd21deC0538',
      name: 'create-role',
      users: [ '1' ],
      applicationId: clientId,
      permissions: [ permissions[2]._id ]
    },
    {
      _id: 'D66a418065aa426ca9455fd21deC0538',
      name: 'comment-role',
      applicationId: clientId,
      permissions: [ permissions[3]._id ]
    },
    {
      _id: 'E66a418065aa426ca9455fd21deC0538',
      name: 'delete-role',
      applicationId: `${clientId}_2`,
      permissions: [ permissions[4]._id ]
    }
  ];
  const groups = [
    {
      _id: 'A56a418065aa426ca9455fd21deC0538',
      name: 'main',
      nested: [ 'B56a418065aa426ca9455fd21deC0538' ],
      roles: [ roles[0]._id ]
    },
    {
      _id: 'B56a418065aa426ca9455fd21deC0538',
      name: 'sub',
      members: [ '1' ],
      roles: [ roles[1]._id, roles[4]._id ]
    },
    {
      _id: 'C56a418065aa426ca9455fd21deC0538',
      name: 'mapped',
      mappings: [ {
        _id: 'fced71ef1ece4d58a4267116adc52b91',
        groupName: 'google-group',
        connectionName: 'google-oauth2'
      } ],
      roles: [ roles[3]._id ]
    }
  ];

  before((done) => {
    db.getGroups = () => Promise.resolve(groups);
    db.getRoles = () => Promise.resolve(roles);
    db.getPermissions = () => Promise.resolve(permissions);
    db.provider = { storageContext: { read: () => Promise.resolve({ groups, roles, permissions }) } };

    done();
  });

  describe('#POST', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'POST',
        url: '/api/groups/hierarchy'
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return groups, roles and permissions for user', (cb) => {
      const options = {
        method: 'POST',
        url: '/api/groups/hierarchy',
        payload: {
          groups: [ 'sub' ]
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('object');
        expect(response.result.main).to.be.a('object');
        expect(response.result.sub).to.be.a('object');
        expect(response.result.main.roles).to.be.a('array');
        expect(response.result.sub.roles).to.be.a('array');
        expect(response.result.main.roles[0].permissions).to.be.a('array');
        expect(response.result.sub.roles[0].permissions).to.be.a('array');
        expect(response.result.sub.roles[1].permissions).to.be.a('array');
        expect(response.result.main.roles[0].name).to.be.equal('read-role');
        expect(response.result.sub.roles[0].name).to.be.equal('update-role');
        expect(response.result.sub.roles[1].name).to.be.equal('delete-role');
        expect(response.result.main.roles[0].permissions[0].name).to.be.equal('read');
        expect(response.result.sub.roles[0].permissions[0].name).to.be.equal('update');
        expect(response.result.sub.roles[1].permissions[0].name).to.be.equal('delete');
        cb();
      });
    });

    it('should return groups, roles and permissions for user, based on clientId', (cb) => {
      const options = {
        method: 'POST',
        url: `/api/groups/hierarchy/${clientId}`,
        payload: {
          groups: [ 'sub' ]
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('object');
        expect(response.result.main).to.be.a('object');
        expect(response.result.sub).to.be.a('object');
        expect(response.result.main.roles).to.be.a('array');
        expect(response.result.sub.roles).to.be.a('array');
        expect(response.result.sub.roles.length).to.be.equal(1);
        expect(response.result.main.roles[0].permissions).to.be.a('array');
        expect(response.result.sub.roles[0].permissions).to.be.a('array');
        expect(response.result.main.roles[0].name).to.be.equal('read-role');
        expect(response.result.sub.roles[0].name).to.be.equal('update-role');
        expect(response.result.main.roles[0].permissions[0].name).to.be.equal('read');
        expect(response.result.sub.roles[0].permissions[0].name).to.be.equal('update');
        cb();
      });
    });

    it('should return groups and roles if there are no permissions in the config', (cb) => {
      db.provider = { storageContext: { read: () => Promise.resolve({ groups, roles }) } };
      const options = {
        method: 'POST',
        url: `/api/groups/hierarchy/${clientId}`,
        payload: {
          groups: [ 'sub' ]
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('object');
        expect(response.result.main).to.be.a('object');
        expect(response.result.sub).to.be.a('object');
        expect(response.result.main.roles).to.be.a('array');
        expect(response.result.sub.roles).to.be.a('array');
        expect(response.result.sub.roles.length).to.be.equal(1);
        expect(response.result.main.roles[0].name).to.be.equal('read-role');
        expect(response.result.sub.roles[0].name).to.be.equal('update-role');
        cb();
      });
    });

    it('should return groups if there are no roles in the config', (cb) => {
      db.provider = { storageContext: { read: () => Promise.resolve({ groups, permissions }) } };
      const options = {
        method: 'POST',
        url: `/api/groups/hierarchy/${clientId}`,
        payload: {
          groups: [ 'sub' ]
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('object');
        expect(response.result.main).to.be.a('object');
        expect(response.result.sub).to.be.a('object');
        cb();
      });
    });

    it('should return error if unable to read from storage', (cb) => {
      db.provider = null;

      const options = {
        method: 'POST',
        url: `/api/groups/hierarchy/${clientId}`,
        payload: {
          groups: [ 'main' ]
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal('Storage error.');

        cb();
      });
    });
  });
});
