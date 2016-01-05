import getDb from 'mongo-getdb';

export default class MongoDbProvider {
  init(connectionString) {
    getDb.init('data', connectionString);
  }

  getRecords(collection) {
    return new Promise((resolve, reject) => {
      getDb('data', (db) =>
        db.collection(collection)
          .find({})
          .toArray((err, records) => {
            if (err) {
              return reject(err);
            }

            resolve(records);
          }));
    });
  }

  getRecord(collection, query) {
    return new Promise((resolve, reject) => {
      getDb('data', (db) =>
        db.collection(collection)
          .findOne(query, (err, record) => {
            if (err) {
              return reject(err);
            }

            if (!record) {
              return reject({ notFoundError: 'A record with this identifier was not found.' });
            }

            resolve(record);
          }));
    });
  }

  createRecord(collection, identifier, record) {
    return new Promise((resolve, reject) => {
      getDb('data', (db) =>
        db.collection(collection)
          .findOne(identifier, (err, existingRecord) => {
            if (err) {
              return reject(err);
            }

            if (existingRecord) {
              return reject({ validationError: 'A record with this identifier already exists.' });
            }

            db.collection(collection).insert(record, { w: 1 }, (err) => {
              if (err) {
                return reject(err);
              }

              resolve();
            });
          }));
    });
  }

  updateRecord(collection, identifier, record) {
    return new Promise((resolve, reject) => {
      getDb('data', (db) =>
        db.collection(collection)
          .findOne(identifier, (err, existingRecord) => {
            if (err) {
              return reject(err);
            }

            if (!existingRecord) {
              return reject({ validationError: 'A record with this identifier does not exist.' });
            }

            db.collection(collection).update(identifier, record, { w: 1 }, (err) => {
              if (err) {
                return reject(err);
              }

              resolve();
            });
          }));
    });
  }

  deleteRecord(collection, identifier) {
    return new Promise((resolve, reject) => {
      getDb('data', (db) =>
        db.collection(collection)
          .findOne(identifier, (err, existingRecord) => {
            if (err) {
              return reject(err);
            }

            if (!existingRecord) {
              return reject({ validationError: 'A record with this identifier does not exist.' });
            }

            db.collection(collection).deleteOne(identifier, (err) => {
              if (err) {
                return reject(err);
              }

              resolve();
            });
          }));
    });
  }
}
