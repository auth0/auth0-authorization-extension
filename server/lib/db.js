import _ from 'lodash';
import path from 'path';
import Low from 'lowdb';
import storage from 'lowdb/file-async';

const low = new Low(path.resolve(__dirname, '../data/db.json'), { storage, autosave: true });
low('config').cloneDeep();

class Database {
  getRecords(collection) {
    return new Promise((resolve) => {
      resolve(low(collection).cloneDeep());
    });
  }

  getRecord(collection, query) {
    return new Promise((resolve, reject) => {
      let record = low(collection).find(query);
      if (!record) {
        return reject({ notFoundError: 'A record with this identifier was not found.' });
      }

      resolve(_.cloneDeep(record));
    });
  }

  createRecord(collection, identifier, record) {
    return new Promise((resolve, reject) => {
      let existingRecord = low(collection).find(identifier);
      if (existingRecord) {
        return reject({ validationError: 'A record with this identifier already exists.' });
      }

      low(collection)
        .push(record)
        .then(resolve)
        .catch(reject);
    });
  }

  updateRecord(collection, identifier, record) {
    return new Promise((resolve, reject) => {
      let existingRecord = low(collection).find(identifier);
      if (!existingRecord) {
        return reject({ validationError: 'A record with this identifier does not exist.' });
      }

      const update = low(collection)
        .chain()
        .find(identifier)
        .assign(record)
        .value();
      Promise.resolve(update)
        .then(resolve)
        .catch(reject);
    });
  }

  deleteRecord(collection, identifier) {
    return new Promise((resolve, reject) => {
      let existingRecord = low(collection).find(identifier);
      if (!existingRecord) {
        return resolve();
      }

      low(collection)
        .remove(identifier)
        .then(resolve)
        .catch(reject);
    });
  }
}

export default new Database();
