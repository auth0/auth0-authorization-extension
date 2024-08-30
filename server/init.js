// eslint-disable-next-line import/no-extraneous-dependencies
import { URL } from 'node:url';

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


  const publicUrl = config('PUBLIC_WT_URL');
  const host = new URL(publicUrl).hostname;
  const isLayer0TestSpace = host.split('.').slice(-2).join('.') === 'auth0c.com';
  // the purpose of this variable is to disable the caching in development environments
  config.setValue('IS_LAYER0_TEST_SPACE', isLayer0TestSpace);


  // Initialize the storage layer.
  initDb(
    new Database({
      provider: createProvider(storageContext)
    })
  );

  // Start the server.
  return createServer(cb);
};
