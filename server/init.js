import { FileStorageContext, WebtaskStorageContext, BlobRecordProvider } from 'auth0-extension-tools';
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
  // Initialize database based on config.
  const context = storageContext
    ? new WebtaskStorageContext(storageContext, { force: 1 })
    : new FileStorageContext(path.join(__dirname, './data.json'), { mergeWrites: true });
  const provider = new BlobRecordProvider(context);

  config.setProvider(cfg);

  initDb(new Database({ provider }));

  // Start the server.
  createServer(cb);
};
