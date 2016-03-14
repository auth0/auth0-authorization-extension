import AWS from 'aws-sdk';
import nconf from 'nconf';
import { expect } from 'chai';

import S3Provider from '../../server/lib/storage/providers/s3'

describe('S3Provider (Storage Provider)', () => {
  var s3;
  var provider;
  
  before(() => {
    s3 = new AWS.S3({ params: { Bucket: nconf.get('AWS_S3_BUCKET') } });
    s3.config.credentials = new AWS.Credentials(
      nconf.get('AWS_ACCESS_KEY_ID'),
      nconf.get('AWS_SECRET_ACCESS_KEY')
    );
    
    provider = new S3Provider({
      path: 'test-db.json',
      bucket: nconf.get('AWS_S3_BUCKET'),
      keyId: nconf.get('AWS_ACCESS_KEY_ID'),
      keySecret: nconf.get('AWS_SECRET_ACCESS_KEY')
    });
  });
  
  describe('#constructor', () => {
    it('should require a bucket', (done) => {
      const run = () => {
        const s3 = new S3Provider();
      };
      expect(run)
        .to.throw('The \'bucket\' property is required when configuring the S3Provider.');
      done();
    });
    
    it('should require a keyId', (done) => {
      const run = () => {
        const s3 = new S3Provider({
          bucket: 'mybucket'
        });
      };
      expect(run)
        .to.throw('The \'keyId\' property is required when configuring the S3Provider.');
      done();
    });
    
    it('should require a keySecret', (done) => {
      const run = () => {
        const s3 = new S3Provider({
          bucket: 'mybucket',
          keyId: 'AAAA'
        });
      };
      expect(run)
        .to.throw('The \'keySecret\' property is required when configuring the S3Provider.');
      done();
    });
    
    it('should initialize correctly', (done) => {
      const s3 = new S3Provider({
        bucket: 'mybucket',
        keyId: 'AAAA',
        keySecret: 'BBB'
      });
      done();
    });
  });
  
  describe('#getRecords', () => {
    beforeEach((done) => {
      s3.deleteObject({ Key: 'test-db.json' }, (err, data) => {
        done(err);
      });
    });

    it('should return empty array if collection does not exist', (done) => {
      provider.getRecords('some-collection')
        .then((records) => {
          expect(records).to.be.instanceof(Array);
          expect(records).to.be.empty;
          done();
        })
        .catch(err => done(err));
    });

    it('should return the complete collection', (done) => {
      let params = {
        Key: 'test-db.json',
        Body: JSON.stringify({ 
          groups: [
            { _id: '1', name: 'group 1' },
            { _id: '2', name: 'group 2' },
          ]
        }),
        ContentType: 'application/json'
      };
      s3.putObject(params, (err) => {
        provider.getRecords('groups')
          .then((records) => {
            expect(records).to.be.instanceof(Array);
            expect(records).to.have.lengthOf(2);
            expect(records[1].name).to.equal('group 2');
            done();
          })
          .catch(err => done(err));
      });
    });
  });
  
  describe('#getRecord', () => {
    beforeEach((done) => {
      s3.deleteObject({ Key: 'test-db.json' }, (err, data) => {
        done(err);
      });
    });

    it('should throw if record does not exist', (done) => {
      provider.getRecord('groups', '1')
        .catch((err) => {
          expect(err).to.be.an('error');
          expect(err.name).to.equal('NotFoundError');
          done();
        });
    });

    it('should return the record if it exists', (done) => {
      let params = {
        Key: 'test-db.json',
        Body: JSON.stringify({ 
          groups: [
            { _id: 'abc1', name: 'group 1' },
            { _id: 'abc2', name: 'group 2' },
          ]
        }),
        ContentType: 'application/json'
      };

      s3.putObject(params, (err) => {
        provider.getRecord('groups', 'abc2')
          .then((record) => {
            expect(record._id).to.equal('abc2');
            expect(record.name).to.equal('group 2');
            done();
          })
          .catch(err => done(err));
      });
    });
  });
  
  describe('#createRecord', () => {
    beforeEach((done) => {
      s3.deleteObject({ Key: 'test-db.json' }, (err, data) => {
        done(err);
      });
    });

    it('should create the record if it does not exist', (done) => {
      provider.createRecord('groups', { _id: 'abc12345', name: 'my group' })
        .then(() => {
          provider.getRecord('groups', 'abc12345')
            .then((record) => {
              expect(record._id).to.equal('abc12345');
              expect(record.name).to.equal('my group');
              done();
            })
            .catch(err => done(err));
        });
    });

    it('should generate a unique id if none is provided', (done) => {
      provider.createRecord('groups', { name: 'my group' })
        .then((newRecord) => {
          expect(newRecord._id).to.not.be.null;
          expect(newRecord._id).to.not.be.undefined;

          provider.getRecord('groups', newRecord._id)
            .then((record) => {
              expect(record._id).to.equal(newRecord._id);
              expect(record.name).to.equal('my group');
              done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('should throw if record already exists', (done) => {
      let params = {
        Key: 'test-db.json',
        Body: JSON.stringify({ 
          groups: [
            { _id: 'abc1', name: 'group 1' },
            { _id: 'abc2', name: 'group 2' },
          ]
        }),
        ContentType: 'application/json'
      };

      s3.putObject(params, (err) => {
        provider.createRecord('groups', { _id: 'abc1', name: 'my group' })
          .catch((err) => {
            expect(err).to.be.an('error');
            expect(err.name).to.equal('ValidationError');
            done();
          });
      });
    });
  });
  
  describe('#updateRecord', () => {
    beforeEach((done) => {
      s3.deleteObject({ Key: 'test-db.json' }, (err, data) => {
        done(err);
      });
    });

    it('should update the record if it exist', (done) => {
      let params = {
        Key: 'test-db.json',
        Body: JSON.stringify({ 
          groups: [
            { _id: 'abc1', name: 'group 1' },
            { _id: 'abc2', name: 'group 2' },
          ]
        }),
        ContentType: 'application/json'
      };

      s3.putObject(params, (err) => {
        provider.updateRecord('groups', 'abc1', { name: 'my group' })
          .then(() => {
            provider.getRecord('groups', 'abc1')
              .then((record) => {
                expect(record._id).to.equal('abc1');
                expect(record.name).to.equal('my group');
                done();
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      });
    });

    it('should support patching', (done) => {
      let params = {
        Key: 'test-db.json',
        Body: JSON.stringify({ 
          groups: [
            { _id: 'abc1', name: 'group 1', description: 'aaa', users: ['a', 'b', 'c'] },
            { _id: 'abc2', name: 'group 2', description: 'bbb', users: ['d', 'e', 'f'] },
          ]
        }),
        ContentType: 'application/json'
      };

      s3.putObject(params, (err) => {
        provider.updateRecord('groups', 'abc1', { name: 'my group' })
          .then(() => {
            provider.getRecord('groups', 'abc1')
              .then((record) => {
                expect(record._id).to.equal('abc1');
                expect(record.name).to.equal('my group');
                expect(record.description).to.equal('aaa');
                expect(record.users[2]).to.equal('c');
                done();
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      });
    });

    it('should throw if record does not exist', (done) => {
      let params = {
        Key: 'test-db.json',
        Body: JSON.stringify({ 
          groups: [
            { _id: 'abc1', name: 'group 1' },
            { _id: 'abc2', name: 'group 2' },
          ]
        }),
        ContentType: 'application/json'
      };

      s3.putObject(params, (err) => {
        provider.updateRecord('groups', 'abc3', { name: 'my group' })
          .catch((err) => {
            expect(err).to.be.an('error');
            expect(err.name).to.equal('ValidationError');
            done();
          });
      });
    });
  });
  
  describe('#deleteRecord', () => {
    beforeEach((done) => {
      s3.deleteObject({ Key: 'test-db.json' }, (err, data) => {
        done(err);
      });
    });

    it('should delete the record if it exist', (done) => {
      let params = {
        Key: 'test-db.json',
        Body: JSON.stringify({ 
          groups: [
            { _id: 'abc1', name: 'group 1' },
            { _id: 'abc2', name: 'group 2' },
          ]
        }),
        ContentType: 'application/json'
      };

      s3.putObject(params, (err) => {
        provider.deleteRecord('groups', 'abc1')
          .then(() => {
            provider.getRecord('groups', 'abc1')
              .catch((err) => {
                expect(err).to.be.an('error');
                expect(err.name).to.equal('NotFoundError');
                done();
              });
          })
          .catch(err => done(err));
      });
    });

    it('should fake delete the record if it does not exist', (done) => {
      let params = {
        Key: 'test-db.json',
        Body: JSON.stringify({ 
          groups: [
            { _id: 'abc1', name: 'group 1' },
            { _id: 'abc2', name: 'group 2' },
          ]
        }),
        ContentType: 'application/json'
      };

      s3.putObject(params, (err) => {
        provider.deleteRecord('groups', 'abc3')
          .then(() => {
            provider.getRecord('groups', 'abc3')
              .catch((err) => {
                expect(err).to.be.an('error');
                expect(err.name).to.equal('NotFoundError');
                done();
              });
          });
      });
    });
  });
});    