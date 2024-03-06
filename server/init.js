import config from './lib/config';
import Database from './lib/storage/database';
import { init as initDb } from './lib/storage/getdb';
import { createProvider } from './lib/storage/providers';

import createServer from './';
import logger from './lib/logger';

export default (cfg, storageContext, cb) => {
  if (cb == null) {
    cb = err => {
      if (err) {
        logger.error('Hapi initialization failed.');
        const { stack, details, message } = err;
        logger.error({ stack, details, message });
        logger.error(err);
      } else {
        logger.info('Hapi initialization completed.');
      }
    };
  }

  // Set configuration provider.
  config.setProvider(key => cfg(key) || process.env[key]);

  // Initialize the storage layer.
  initDb(
    new Database({
      provider: createProvider(storageContext)
    })
  );

  // Start the server.
  return createServer(cb);
};
