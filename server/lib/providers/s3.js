import _ from 'lodash';
import nconf from 'nconf';
import AWS from 'aws-sdk';

export class S3Provider {
  init(options) {
    this.s3 = new AWS.S3({ params: { Bucket: options.AWS_S3_BUCKET } });
    this.s3.config.credentials = new AWS.Credentials(
      nconf.get(options.AWS_ACCESS_KEY_ID),
      nconf.get(options.AWS_SECRET_ACCESS_KEY)
    );
  }

  getRecords(collection) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: collection
      };
      this.getS3().getObject(params, (err, response) => {
        if (err) { return reject(err); }

        const data = JSON.parse(response.Body.toString());
        resolve(data);
      });
    });
  }

  getRecord(collection, query) {
    return this.getRecords(collection)
      .then(records => {
        return new Promise((resolve, reject) => {
          let record = _.find(records, query);
          if (!record) {
            return reject({ notFoundError: 'A record with this identifier was not found.' });
          }

          resolve(_.cloneDeep(record));
        });
      });
  }

  createRecord(collection, identifierQuery, record) {
    return this.getRecords(collection)
      .then(records => {
        return new Promise((resolve, reject) => {
          let index = _.findIndex(records, identifierQuery);
          if (index >= 0) {
            return reject({ validationError: 'A record with this identifier already exists.' });
          }

          records.push(record);

          let params = {
            Key: collection,
            Body: JSON.stringify(records),
            ContentType: 'application/json'
          };
          this.getS3().putObject(params, (err) => {
            if (err) { return reject(err); }
            resolve();
          });
        });
      });
  }

  updateRecord(collection, identifierQuery, record) {
    return this.getRecords(collection)
      .then(records => {
        return new Promise((resolve, reject) => {
          let index = _.findIndex(records, identifierQuery);
          if (index < 0) {
            return reject({ validationError: 'A record with this identifier does not exist.' });
          }

          records[index] = record;

          let params = {
            Key: collection,
            Body: JSON.stringify(records),
            ContentType: 'application/json'
          };
          this.getS3().putObject(params, (err) => {
            if (err) { return reject(err); }
            resolve();
          });
        });
      });
  }

  deleteRecord(collection, identifierQuery) {
    return this.getRecords(collection)
      .then(records => {
        return new Promise((resolve, reject) => {
          let index = _.findIndex(records, identifierQuery);
          if (index < 0) {
            return resolve();
          }
          records.splice(index, 1);

          let params = {
            Key: collection,
            Body: JSON.stringify(records),
            ContentType: 'application/json'
          };
          this.getS3().putObject(params, (err) => {
            if (err) { return reject(err); }
            resolve();
          });
        });
      });
  }
}
