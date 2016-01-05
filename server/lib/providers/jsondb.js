import _ from 'lodash';
import Low from 'lowdb';
import storage from 'lowdb/file-async';

import { NotFoundError, ValidationError } from '../errors';

export default class JsonDbProvider {
  init(path) {
    this.low = new Low(path, { storage, autosave: true });
    this.low('config').cloneDeep();
  }

  getRecords(collection) {
    return new Promise((resolve) => {
      resolve(this.low(collection).cloneDeep());
    });
  }

  getRecord(collection, query) {
    return new Promise((resolve, reject) => {
      let record = this.low(collection).find(query);
      if (!record) {
        return reject(new NotFoundError('A record with this identifier was not found.'));
      }

      resolve(_.cloneDeep(record));
    });
  }

  createRecord(collection, identifier, record) {
    return new Promise((resolve, reject) => {
      let existingRecord = this.low(collection).find(identifier);
      if (existingRecord) {
        return reject(new ValidationError('A record with this identifier already exists.'));
      }

      this.low(collection)
        .push(record)
        .then(resolve)
        .catch(reject);
    });
  }

  updateRecord(collection, identifier, record) {
    return new Promise((resolve, reject) => {
      let existingRecord = this.low(collection).find(identifier);
      if (!existingRecord) {
        return reject(new ValidationError('A record with this identifier does not exist.'));
      }

      const update = this.low(collection)
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
      let existingRecord = this.low(collection).find(identifier);
      if (!existingRecord) {
        return resolve();
      }

      this.low(collection)
        .remove(identifier)
        .then(resolve)
        .catch(reject);
    });
  }
}
