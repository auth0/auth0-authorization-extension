import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';

import Errors from 'auth0-extension-tools';

const logger = require('../logger');

export class S3StorageContext {

  // eslint-disable-next-line no-undef
  #regionRedirectErrorCodes = [
    'AuthorizationHeaderMalformed', // non-head operations on virtual-hosted global bucket endpoints
    'BadRequest', // head operations on virtual-hosted global bucket endpoints
    'PermanentRedirect', // non-head operations on path-style or regional endpoints
    301 // head operations on path-style or regional endpoints
  ];

  /**
   * @param {Object} options The options object.
   * @param {Object} options.defaultData The default data to use when the file does not exist or is empty.
   */
  constructor(options) {
    if (options === null || options === undefined) {
      throw new Errors.ArgumentError('The \'options\' object is required when configuring the S3StorageContext.');
    }
    if (!options.path || options.path.length === 0) {
      throw new Errors.ArgumentError('The \'path\' property is required when configuring the S3StorageContext.');
    }
    if (!options.bucket || options.bucket.length === 0) {
      throw new Errors.ArgumentError('The \'bucket\' property is required when configuring the S3StorageContext.');
    }
    if (!options.keyId || options.keyId.length === 0) {
      throw new Errors.ArgumentError('The \'keyId\' property is required when configuring the S3StorageContext.');
    }
    if (!options.keySecret || options.keySecret.length === 0) {
      throw new Errors.ArgumentError('The \'keySecret\' property is required when configuring the S3StorageContext.');
    }

    this.options = options;
    this.defaultData = options.defaultData || {};

    this.#setupS3Client();
  }

  /**
   * Read payload from S3.
   * @return {object} The object parsed from S3.
   */
  async read() {
    return this.#handleRegionRedirect(async () => {
      const params = {
        Key: this.options.path,
        Bucket: this.options.bucket
      };

      try {
        const response = await this.s3Client.send(new GetObjectCommand(params));
        const body = await response?.Body?.transformToString();
        return body ? JSON.parse(body) : this.defaultData;
      } catch (err) {
        if (err.Code === 'NoSuchKey') {
          return this.defaultData;
        }
        throw err;
      }
    });
  }

  async write(data) {
    return this.#handleRegionRedirect(async () => {
      const params = {
        Key: this.options.path,
        Bucket: this.options.bucket,
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json'
      };

      await this.s3Client.send(new PutObjectCommand(params));
    });
  }

  async #handleRegionRedirect(operation) {
    try {
      return await operation();
    } catch (err) {
      logger.info('Trying to resolve s3 bucket region...');

      const region = err.$response?.headers['x-amz-bucket-region'] || null;
      const currentRegion = await this.s3Client.config.region();

      if (this.#regionRedirectErrorCodes.indexOf(err.Code) !== -1 && region && region !== currentRegion) {
        logger.info(`Resolved following s3 bucket region: ${region}.`);

        this.#setupS3Client(region);
        return await operation(); // Retry with new region
      }

      throw err;
    }
  }

  // eslint-disable-next-line no-dupe-class-members
  #setupS3Client(region = 'us-east-1') {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.options.keyId,
        secretAccessKey: this.options.keySecret
      },
      region: region
    });
  }
}
