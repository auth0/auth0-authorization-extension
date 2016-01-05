import nconf from 'nconf';
import mongodbUri from 'mongodb-uri';

import logger from '../logger';
import JsonDbProvider from './jsondb';
import MongoDbProvider from './mongodb';
import S3Provider from './s3';

let currentProvider = null;

export function init(provider) {
  switch (provider) {
    case 's3':
      currentProvider = new S3Provider();
      currentProvider.init({
        AWS_S3_BUCKET: nconf.get('AWS_S3_BUCKET'),
        AWS_ACCESS_KEY_ID: nconf.get('AWS_ACCESS_KEY_ID'),
        AWS_SECRET_ACCESS_KEY: nconf.get('AWS_SECRET_ACCESS_KEY')
      });

      logger.info(`Initialized data with S3 Provider: ${nconf.get('AWS_S3_BUCKET')}`);
      return;
    case 'jsondb':
      currentProvider = new JsonDbProvider();
      currentProvider.init(nconf.get('JSONDB_PATH'));

      logger.info(`Initialized data with JsonDb Provider: ${nconf.get('JSONDB_PATH')}`);
      return;
    case 'mongodb':
      const connectionString = nconf.get('MONGODB_CONNECTION_STRING');
      if (!connectionString) {
        throw new Error('MONGODB_CONNECTION_STRING is required.');
      }

      currentProvider = new MongoDbProvider();
      currentProvider.init(connectionString);

      const uriObject = mongodbUri.parse(connectionString);
      logger.info(`Initialized data with MongoDb Provider: mongodb://${uriObject.username}:***@${uriObject.hosts[0].host}...`);
      break;
    default:
      throw new Error(`Unsupported data provider: ${provider}`);
  }
}

export function getProvider() {
  return currentProvider;
}
