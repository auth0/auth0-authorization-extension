import Database from './lib/storage/database';
import { S3Provider } from './lib/storage/providers';
import { init as initDb } from './lib/storage/getdb';

import config from './lib/config';
import createServer from './';

module.exports = (options = { }, cb) => {
  // Initialize database.
  initDb(new Database({
    provider: options.storageProvider || new S3Provider({
      path: 'auth0-authz.json',
      bucket: config('AWS_S3_BUCKET'),
      keyId: config('AWS_ACCESS_KEY_ID'),
      keySecret: config('AWS_SECRET_ACCESS_KEY')
    })
  }));

  // Start the server.
  createServer(cb);
};
