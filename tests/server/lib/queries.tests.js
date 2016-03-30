import uuid from 'node-uuid';
import Promise from 'bluebird';
import { expect } from 'chai';

import { isApplicationAccessAllowed, getUserGroups, getDynamicUserGroups } from '../../../server/lib/queries';

const mockGroups = (groups) => ({
  hash: uuid.v4(),
  getGroups: () => new Promise((resolve) => {
    resolve(groups);
  })
});

const mockApplications = (applications) => ({
  hash: uuid.v4(),
  getApplications: () => new Promise((resolve) => {
    resolve(applications);
  })
});

const mockConnections = (connections) => ({
  hash: uuid.v4(),
  connections: {
    getAll: () => new Promise((resolve) => {
      resolve(connections);
    })
  }
});

describe('Queries', () => {
  describe('#isApplicationAccessAllowed', () => {
    it('should return true if no groups have been configured', (done) => {
      const db = mockApplications([
        { _id: '123' }
      ]);

      isApplicationAccessAllowed(db, '777', [ 'Marketing', 'HR' ])
        .then((isAllowed) => {
          expect(isAllowed).to.equal(true);
          done();
        })
        .catch(err => done(err));
    });

    it('should return true if application groups is empty', (done) => {
      const db = mockApplications([
        { _id: '777', groups: [ ] }
      ]);

      isApplicationAccessAllowed(db, '777', [ 'Marketing', 'HR' ])
        .then((isAllowed) => {
          expect(isAllowed).to.equal(true);
          done();
        })
        .catch(err => done(err));
    });

    it('should return false if current groups dont match the application groups', (done) => {
      const db = mockApplications([
        { _id: '777', groups: [ 'Finance', 'IT' ] }
      ]);

      isApplicationAccessAllowed(db, '777', [ 'Marketing', 'HR' ])
        .then((isAllowed) => {
          expect(isAllowed).to.equal(false);
          done();
        })
        .catch(err => done(err));
    });

    it('should return true if current groups match the application groups', (done) => {
      const db = mockApplications([
        { _id: '777', groups: [ 'Finance', 'IT', 'HR' ] }
      ]);

      isApplicationAccessAllowed(db, '777', [ 'Marketing', 'HR' ])
        .then((isAllowed) => {
          expect(isAllowed).to.equal(true);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe.only('#getUserGroups', () => {
    it('should return an empty array if user does not belong to any groups', (done) => {
      const db = mockGroups([
        { _id: '123', name: 'Group 1', members: [ '111', '222', '333' ] },
        { _id: '456', name: 'Group 2', members: [ '444', '555', '666' ] }
      ]);

      getUserGroups(db, '777')
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(0);
          done();
        })
        .catch(err => done(err));
    });

    it('should group memberships if user belongs to groups', (done) => {
      const db = mockGroups([
        { _id: '123', name: 'Group 1', members: [ '111', '222', '333' ] },
        { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
        { _id: '789', name: 'Group 3', members: [ '777' ] }
      ]);

      getUserGroups(db, '777')
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(2);
          expect(groups[0]).to.equal('Group 2');
          done();
        })
        .catch(err => done(err));
    });

    it('should handle empty group memberships', (done) => {
      const db = mockGroups([
        { _id: '123', name: 'Group 1' },
        { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
        { _id: '789', name: 'Group 3' }
      ]);

      getUserGroups(db, '777')
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(1);
          expect(groups[0]).to.equal('Group 2');
          done();
        })
        .catch(err => done(err));
    });

    it('should handle nested groups', (done) => {
      const db = mockGroups([
        { _id: '123', name: 'Group 1', nested: [ '456' ] },
        { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
        { _id: '789', name: 'Group 3' }
      ]);

      getUserGroups(db, '777')
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(2);
          expect(groups[0]).to.equal('Group 1');
          expect(groups[1]).to.equal('Group 2');
          done();
        })
        .catch(err => done(err));
    });

    it('should handle nested groups that dont belong to the current user', (done) => {
      const db = mockGroups([
        { _id: '123', name: 'Group 1', nested: [ '789' ] },
        { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
        { _id: '789', name: 'Group 3' }
      ]);

      getUserGroups(db, '777')
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(1);
          expect(groups[0]).to.equal('Group 2');
          done();
        })
        .catch(err => done(err));
    });

    it('should handle nested groups (cyclic)', (done) => {
      const db = mockGroups([
        { _id: '123', name: 'Group 1', nested: [ '456', '789' ] },
        { _id: '456', name: 'Group 2', members: [ '444', '555', '666', '777' ] },
        { _id: '789', name: 'Group 3', nested: [ '123', '456', '789' ] }
      ]);

      getUserGroups(db, '777')
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(3);
          expect(groups[0]).to.equal('Group 1');
          expect(groups[1]).to.equal('Group 2');
          expect(groups[2]).to.equal('Group 3');
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('#getDynamicUserGroups', () => {
    it('should not run if connection is empty', (done) => {
      getDynamicUserGroups({ }, null, [])
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(0);
          done();
        })
        .catch(err => done(err));
    });

    it('should not run if existing group memberships are empty', (done) => {
      getDynamicUserGroups({ }, '123', null)
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(0);
          done();
        })
        .catch((err) => done(err));
    });

    it('should return empty if the current transaction does not match any groups', (done) => {
      const auth0 = mockConnections([
          { id: 'abc', name: 'my-ad' },
          { id: 'def', name: 'other-ad' }
      ]);

      const db = mockGroups([
        { _id: '123', name: 'Group 1', mappings:
          [ { _id: '12345', groupName: 'Domain Users', connectionId: 'abc' } ]
        },
        { _id: '456', name: 'Group 2', mappings:
          [ { _id: '67890', groupName: 'Domain Users', connectionId: 'def' } ]
        }
      ]);

      getDynamicUserGroups(auth0, db, 'abc', [ 'Domain Admins' ])
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(0);
          done();
        })
        .catch(err => done(err));
    });

    it('should return empty if the connection no longer exists', (done) => {
      const auth0 = mockConnections([ ]);

      const db = mockGroups([
        { _id: '123', name: 'Group 1', mappings:
          [ { _id: '12345', groupName: 'Domain Admins', connectionId: 'abc' } ]
        },
        { _id: '456', name: 'Group 2', mappings:
          [ { _id: '67890', groupName: 'Domain Users', connectionId: 'abc' } ]
        }
      ]);

      getDynamicUserGroups(auth0, db, 'abc', [ 'Domain Admins' ])
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(0);
          done();
        })
        .catch(err => done(err));
    });

    it('should return empty if the current transaction does not match any groups', (done) => {
      const auth0 = mockConnections([
          { id: 'abc', name: 'my-ad' },
          { id: 'def', name: 'other-ad' }
      ]);

      const db = mockGroups([
        { _id: '123', name: 'Group 1', mappings:
          [ { _id: '12345', groupName: 'Domain Users', connectionId: 'abc' } ]
        },
        { _id: '456', name: 'Group 2', mappings:
          [ { _id: '67890', groupName: 'Domain Users', connectionId: 'def' } ]
        }
      ]);

      getDynamicUserGroups(auth0, db, 'my-ad', [ 'Domain Admins' ])
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(0);
          done();
        })
        .catch(err => done(err));
    });

    it('should mappings that match the current transaction', (done) => {
      const auth0 = mockConnections([
          { id: 'abc', name: 'my-ad' },
          { id: 'def', name: 'other-ad' }
      ]);

      const db = mockGroups([
        { _id: '123', name: 'Group 1', mappings:
          [ { _id: '12345', groupName: 'Domain Users', connectionId: 'abc' } ]
        },
        { _id: '456', name: 'Group 2', mappings:
          [
            { _id: '67890', groupName: 'Domain Users', connectionId: 'def' },
            { _id: '44444', groupName: 'Domain Admins', connectionId: 'abc' }
          ]
        },
        { _id: '789', name: 'Group 3', mappings:
          [
            { _id: 'aaaaa', groupName: 'Domain Users', connectionId: 'abc' },
            { _id: 'bbbbb', groupName: 'Domain Admins', connectionId: 'abc' }
          ]
        }
      ]);

      getDynamicUserGroups(auth0, db, 'my-ad', [ 'Domain Admins' ])
        .then((groups) => {
          expect(groups).to.be.instanceof(Array);
          expect(groups.length).to.equal(2);
          expect(groups[0]).to.equal('Group 2');
          expect(groups[1]).to.equal('Group 3');
          done();
        })
        .catch((err) => done(err));
    });
  });
});
