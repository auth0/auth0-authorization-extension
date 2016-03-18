import _ from 'lodash';
import AWS from 'aws-sdk';
import uuid from 'node-uuid';
import { ArgumentError, NotFoundError, ValidationError } from '../../errors';

export default class S3Provider {
  constructor({ path = 'iam-dashboard.json', bucket, keyId, keySecret } = { }) {
    if (!bucket || bucket === 0) {
      throw new ArgumentError('The \'bucket\' property is required when configuring the S3Provider.');
    }
    if (!keyId || keyId === 0) {
      throw new ArgumentError('The \'keyId\' property is required when configuring the S3Provider.');
    }
    if (!keySecret || keySecret === 0) {
      throw new ArgumentError('The \'keySecret\' property is required when configuring the S3Provider.');
    }

    this.path = path;
    this.s3 = new AWS.S3({ params: { Bucket: bucket } });
    this.s3.config.credentials = new AWS.Credentials(
      keyId,
      keySecret
    );
  }

  _readObject(collection) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: this.path
      };
      this.s3.getObject(params, (err, response) => {
        if (err) {
          if (err.code === 'NoSuchKey') {
            const defaultData = { };
            defaultData[collection] = [];
            return resolve({ data: defaultData, etag: null });
          }
          return reject(err);
        }

        const data = JSON.parse(response.Body.toString()) || { };
        data[collection] = data[collection] || [];
        return resolve({ data, etag: response.ETag });
      });
    });
  }

  _writeObject(data) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: this.path,
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json'
      };

      this.s3.putObject(params, (err) => {
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

  updateRecord(collection, identifier, record = { }) {
    return this._readObject(collection)
      .then(({ data }) => {
        const index = _.findIndex(data[collection], (r) => r._id === identifier);
        if (index < 0) {
          throw new ValidationError(`The record '${identifier}' in '${collection}' does not exist.`);
        }

        // Update record.
        data[collection][index] = Object.assign({ _id: identifier }, data[collection][index], record);

        // Save.
        return this._writeObject(data)
          .then(() => data[collection][index]);
      });
  }

  deleteRecord(collection, identifier) {
    return this._readObject(collection)
      .then(({ data }) => {
        const index = _.findIndex(data[collection], (r) => r._id === identifier);
        if (index < 0) {
          return;
        }

        // Remove the record.
        data[collection].splice(index, 1);

        // Save.
        return this._writeObject(data)
          .then(() => true);
      });
  }
}
