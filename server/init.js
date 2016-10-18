import { FileStorageContext, WebtaskStorageContext, BlobRecordProvider } from 'auth0-extension-tools';
import path from 'path';

import config from './lib/config';
import Database from './lib/storage/database';
import { init as initDb } from './lib/storage/getdb';

import createServer from './';

module.exports = (options = { }, cb) => {
  // Initialize database based on config.
  const context = (options.storageContext)
    ? new WebtaskStorageContext(options.storageContext, { force: 1 })
    : new FileStorageContext(path.join(__dirname, './data.json'), { mergeWrites: true });
  const provider = new BlobRecordProvider(context);

  config.setProvider(options.configProvider);

  initDb(new Database({ provider }));

  // Start the server.
  createServer(cb);
};
