import _ from 'lodash';
import uuid from 'node-uuid';
import { ArgumentError, NotFoundError, ValidationError } from '../../errors';

export default class WebtaskStorageProvider {
  constructor({ storageContext } = { }) {
    if (!storageContext) {
      throw new ArgumentError('The \'storageContext\' property is required when configuring the WebtaskStorageProvider.');
    }

    this.storageContext = storageContext;
  }

  _readObject(collection) {
    return new Promise((resolve, reject) => {
      this.storageContext.get((err, webtaskData) => {
        if (err) {
          return reject(err);
        }

        const data = webtaskData || { };
        data[collection] = data[collection] || [];
        return resolve({ data });
      });
    });
  }

  _writeObject(data) {
    return new Promise((resolve, reject) => {
      this.storageContext.set(data, { force: 1 }, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }

  getRecords(collection) {
    return this._readObject(collection)
      .then(({ data }) => data[collection]);
  }

  getRecord(collection, identifier) {
    return this._readObject(collection)
      .then(({ data }) => {
        const record = _.find(data[collection], (r) => r._id === identifier);
        if (!record) {
          throw new NotFoundError(`The record '${identifier}' in '${collection}' does not exist.`);
        }

        return record;
      });
  }

  createRecord(collection, record) {
    return this._readObject(collection)
      .then(({ data }) => {
        if (!record._id) {
          record._id = uuid.v4();
        }

        const index = _.findIndex(data[collection], (r) => r._id === record._id);
        if (index > -1) {
          throw new ValidationError(`The record '${record._id}' in '${collection}' already exists.`);
        }

        // Add to dataset.
        data[collection].push(record);

        // Save.
        return this._writeObject(data)
          .then(() => record);
      });
  }

  updateRecord(collection, identifier, record = { }, upsert = false) {
    return this._readObject(collection)
      .then(({ data }) => {
        const index = _.findIndex(data[collection], (r) => r._id === identifier);
        if (index < 0 && !upsert) {
          throw new ValidationError(`The record '${identifier}' in '${collection}' does not exist.`);
        }

        // Update record.
        const updatedRecord = Object.assign({ _id: identifier }, index < 0 ? { } : data[collection][index], record);
        if (index < 0) {
          data[collection].push(updatedRecord);
        } else {
          data[collection][index] = updatedRecord;
        }

        // Save.
        return this._writeObject(data)
          .then(() => updatedRecord);
      });
  }

  deleteRecord(collection, identifier) {
    return this._readObject(collection)
      .then(({ data }) => {
        const index = _.findIndex(data[collection], (r) => r._id === identifier);
        if (index < 0) {
          return false;
        }

        // Remove the record.
        data[collection].splice(index, 1);

        // Save.
        return this._writeObject(data)
          .then(() => true);
      });
  }
}
