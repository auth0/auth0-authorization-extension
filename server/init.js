import { FileStorageContext, WebtaskStorageContext, BlobRecordProvider } from 'auth0-extension-tools';
import { S3StorageContext } from 'auth0-extension-s3-tools';
import { MongoRecordProvider } from 'auth0-extension-mongo-tools';
import path from 'path';

import config from './lib/config';
import Database from './lib/storage/database';
import { init as initDb } from './lib/storage/getdb';

import createServer from './';
import logger from './lib/logger';

module.exports = (cfg, storageContext, cb) => {
  if (cb == null) {
    cb = (err) => {
      if (err) {
        logger.error('Hapi initialization failed.');
        logger.error(err);
      } else {
        logger.info('Hapi initialization completed.');
      }
    };
  }

  // Set configuration provider.
  config.setProvider((key) => cfg(key) || process.env[key]);

  // Initialize database based on config.
  let provider;

  switch (config('DB_TYPE')) {
    case 's3': {
      const context = new S3StorageContext({
        path: '/webtask.json',
        bucket: config('S3_BUCKET'),
        keyId: config('S3_KEY'),
        keySecret: config('S3_SECRET'),
        defaultData: {}
      });
      provider = new BlobRecordProvider(context);
      break;
    }
    case 'mongodb': {
      provider = new MongoRecordProvider(config('MONGO_CONNECTION'));
      break;
    }
    default: {
      const context = storageContext
        ? new WebtaskStorageContext(storageContext, { force: 1 })
        : new FileStorageContext(path.join(__dirname, './data.json'), { mergeWrites: true });
      provider = new BlobRecordProvider(context);
      break;
    }
  }

  initDb(new Database({ provider }));

  // Start the server.
  return createServer(cb);
};
