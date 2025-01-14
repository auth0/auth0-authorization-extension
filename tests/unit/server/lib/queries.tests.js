import uuid from 'node-uuid';
import { expect } from 'chai';
import {

getUserGroups,
getDynamicUserGroups,
getGroupExpanded
} from '../../../../server/lib/queries';

const mockDatabase = (groups, roles, permissions) => ({
  hash: uuid.v4(),
  getGroup: () =>
  new Promise((resolve) => {
    resolve(groups[0]);
  }),
  getGroups: () =>
  new Promise((resolve) => {
    resolve(groups);
  }),
  getRoles: () =>
  new Promise((resolve) => {
    resolve(roles);
  }),
  getPermissions: () =>
  new Promise((resolve) => {
    resolve(permissions);
  })
});

const mockConnections = (connections) => ({
  hash: uuid.v4(),
  connections: {
    getAll: () =>
    new Promise((resolve) => {
      resolve(connections);
    })
  }
});

describe('Queries', () => {
  describe('#getUserGroups', () => {
    it('should return an empty array if user does not belong to any groups', async () => {
      const db = mockDatabase([
      { _id: '123', name: 'Group 1', members: [ '111', '222', '333' ] },
      { _id: '456', name: 'Group 2', members: [ '444', '555', '666' ] }
      ]);

      try {
        const groups = await getUserGroups(db, '777');
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(0);
      } catch (err) {
        throw err;
      }
    });

    it('should group memberships if user belongs to groups', async () => {
      const db = mockDatabase([
      { _id: '123', name: 'Group 1', members: [ '111', '222', '333' ] },
      { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
      { _id: '789', name: 'Group 3', members: [ '777' ] }
      ]);

      try {
        const groups = await getUserGroups(db, '777');
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(2);
        expect(groups[0].name).to.equal('Group 2');
      } catch (err) {
        throw err;
      }
    });

    it('should handle empty group memberships', async () => {
      const db = mockDatabase([
      { _id: '123', name: 'Group 1' },
      { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
      { _id: '789', name: 'Group 3' }
      ]);

      try {
        const groups = await getUserGroups(db, '777');
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(1);
        expect(groups[0].name).to.equal('Group 2');
      } catch (err) {
        throw err;
      }
    });

    it('should handle nested groups', async () => {
      const db = mockDatabase([
      { _id: '123', name: 'Group 1', nested: [ '456' ] },
      { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
      { _id: '789', name: 'Group 3' }
      ]);

      try {
        const groups = await getUserGroups(db, '777');
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(2);
        expect(groups[0].name).to.equal('Group 1');
        expect(groups[1].name).to.equal('Group 2');
      } catch (err) {
        throw err;
      }
    });

    it('should handle nested groups that dont belong to the current user', async () => {
      const db = mockDatabase([
      { _id: '123', name: 'Group 1', nested: [ '789' ] },
      { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
      { _id: '789', name: 'Group 3' }
      ]);

      try {
        const groups = await getUserGroups(db, '777');
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(1);
        expect(groups[0].name).to.equal('Group 2');
      } catch (err) {
        throw err;
      }
    });

    it('should handle nested groups (cyclic)', async () => {
      const db = mockDatabase([
      { _id: '123', name: 'Group 1', nested: [ '456', '789' ] },
      { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
      { _id: '789', name: 'Group 3', nested: [ '123', '456', '789' ] }
      ]);

      try {
        const groups = await getUserGroups(db, '777');
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(3);
        expect(groups[0].name).to.equal('Group 1');
        expect(groups[1].name).to.equal('Group 2');
        expect(groups[2].name).to.equal('Group 3');
      } catch (err) {
        throw err;
      }
    });

    it('should ignore existing group memberships if null', async () => {
      const myDb = mockDatabase([
      { _id: '123', name: 'Group 1', nested: [ '456', '789' ] },
      { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
      { _id: '789', name: 'Group 3', nested: [ '123', '456', '789' ] }
      ]);

      try {
        const groups = await getUserGroups(myDb, '777', 'fabrikam-ad', null);
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(3);
        expect(groups[0].name).to.equal('Group 1');
        expect(groups[1].name).to.equal('Group 2');
        expect(groups[2].name).to.equal('Group 3');
      } catch (err) {
        throw err;
      }
    });

    it('should ignore existing group memberships if undefined', async () => {
      const myDb = mockDatabase([
      { _id: '123', name: 'Group 1', nested: [ '456', '789' ] },
      { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
      { _id: '789', name: 'Group 3', nested: [ '123', '456', '789' ] }
      ]);

      try {
        const groups = await getUserGroups(myDb, '777', 'fabrikam-ad', undefined);
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(3);
        expect(groups[0].name).to.equal('Group 1');
        expect(groups[1].name).to.equal('Group 2');
        expect(groups[2].name).to.equal('Group 3');
      } catch (err) {
        throw err;
      }
    });

    it('should ignore existing group memberships if not an array', async () => {
      const myDb = mockDatabase([
      { _id: '123', name: 'Group 1', nested: [ '456', '789' ] },
      { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
      { _id: '789', name: 'Group 3', nested: [ '123', '456', '789' ] }
      ]);

      try {
        const groups = await getUserGroups(myDb, '777', 'fabrikam-ad', 'this is not right');
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(3);
        expect(groups[0].name).to.equal('Group 1');
        expect(groups[1].name).to.equal('Group 2');
        expect(groups[2].name).to.equal('Group 3');
      } catch (err) {
        throw err;
      }
    });
  });

  describe('#getDynamicUserGroups', () => {
    it('should not run if connection is empty', async () => {
      try {
        const groups = await getDynamicUserGroups(null, []);
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(0);
      } catch (err) {
        throw err;
      }
    });

    it('should not run if existing group memberships are empty', async () => {
      try {
        const groups = await getDynamicUserGroups('123', null);
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(0);
      } catch (err) {
        throw err;
      }
    });

    it('should return empty if the current transaction does not match any groups', async () => {
      mockConnections([
      { id: 'abc', name: 'my-ad' },
      { id: 'def', name: 'other-ad' }
      ]); // eslint-disable-line no-unused-vars

      const db = mockDatabase([
        {
          _id: '123',
          name: 'Group 1',
          mappings: [
          { _id: '12345', groupName: 'Domain Users', connectionName: 'abc' }
          ]
        },
        {
          _id: '456',
          name: 'Group 2',
          mappings: [
          { _id: '67890', groupName: 'Domain Users', connectionName: 'def' }
          ]
        }
      ]);

      try {
        const groups = await getDynamicUserGroups(db, 'abc', [ 'Domain Admins' ]);
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(0);
      } catch (err) {
        throw err;
      }
    });

    it('should return empty if the current transaction does not match any groups', async () => {
      const db = mockDatabase([
        {
          _id: '123',
          name: 'Group 1',
          mappings: [
          { _id: '12345', groupName: 'Domain Users', connectionName: 'abc' }
          ]
        },
        {
          _id: '456',
          name: 'Group 2',
          mappings: [
          { _id: '67890', groupName: 'Domain Users', connectionName: 'def' }
          ]
        }
      ]);

      try {
        const groups = await getDynamicUserGroups(db, 'my-ad', [ 'Domain Admins' ]);
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(0);
      } catch (err) {
        throw err;
      }
    });

    it('should mappings that match the current transaction', async () => {
      const db = mockDatabase([
        {
          _id: '123',
          name: 'Group 1',
          mappings: [
            {
              _id: '12345',
              groupName: 'Domain Users',
              connectionName: 'my-ad'
            }
          ]
        },
        {
          _id: '456',
          name: 'Group 2',
          mappings: [
          { _id: '67890', groupName: 'Domain Users', connectionName: 'def' },
            {
              _id: '44444',
              groupName: 'Domain Admins',
              connectionName: 'my-ad'
            }
          ]
        },
        {
          _id: '789',
          name: 'Group 3',
          mappings: [
            {
              _id: 'aaaaa',
              groupName: 'Domain Users',
              connectionName: 'my-ad'
            },
            {
              _id: 'bbbbb',
              groupName: 'Domain Admins',
              connectionName: 'my-ad'
            }
          ]
        }
      ]);

      try {
        const groups = await getDynamicUserGroups(db, 'my-ad', [ 'Domain Admins' ]);
        expect(groups).to.be.instanceof(Array);
        expect(groups.length).to.equal(2);
        expect(groups[0].name).to.equal('Group 2');
        expect(groups[1].name).to.equal('Group 3');
      } catch (err) {
        throw err;
      }
    });
  });

  describe('#getGroupExpanded', () => {
    it('should return empty if the current transaction does not match any groups', async () => {
      const db = mockDatabase(
      [ { _id: '123', name: 'Group 1', roles: [ 'r1', 'r2' ] } ],
        [
          {
            _id: 'r1',
            name: 'Role 1',
            applicationId: 'app1',
            applicationType: 'client',
            permissions: [ 'p11', 'p12' ]
          },
          {
            _id: 'r2',
            name: 'Role 2',
            applicationId: 'app2',
            applicationType: 'client',
            permissions: [ 'p21', 'p22' ]
          }
        ],
        [
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
        ]
      );

      const group = await getGroupExpanded(db, '123');
      expect(group).to.be.instanceof(Object);
      expect(group.name).to.equal('Group 1');
      expect(group.roles.length).to.equal(2);
      expect(group.roles[0].permissions.length).to.equal(2);
    });
  });
});
