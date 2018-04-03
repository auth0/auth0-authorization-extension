import path from 'path';
import { S3StorageContext } from 'auth0-extension-s3-tools';
import { FileStorageContext, WebtaskStorageContext, BlobRecordProvider } from 'auth0-extension-tools';
import { MongoRecordProvider } from 'auth0-extension-mongo-tools';

import config from '../config';
import logger from '../logger';

export function createProvider(storageContext) {
  switch (config('STORAGE_TYPE')) {
    case 'mongodb': {
      logger.info('Initializing the MongoDB Storage Provider.');
      const mongoProvider = new MongoRecordProvider(config('MONGODB_URL'));
      mongoProvider.storageContext = {
        read: async () => {
          const groups = mongoProvider.getAll('groups');
          const roles = mongoProvider.getAll('roles');
          const permissions = mongoProvider.getAll('permissions');

          const resolved = await Promise.all([groups, roles, permissions]);

          return {
            groups: resolved[0],
            roles: resolved[1],
            permissions: resolved[2]
          };
        }
      };

      return mongoProvider;
    }
    case 's3': {
      logger.info('Initializing the S3 Storage Context.');

      const context = new S3StorageContext({
        path: config('S3_PATH'),
        bucket: config('S3_BUCKET'),
        keyId: config('S3_KEY'),
        keySecret: config('S3_SECRET'),
        defaultData: {}
      });
      return new BlobRecordProvider(context, { concurrentWrites: false });
    }
    case 'webtask':
    default: {
      logger.info('Initializing the Webtask Storage Context.');

      const context = storageContext
          ? new WebtaskStorageContext(storageContext, { force: 0 })
          : new FileStorageContext(path.join(__dirname, '../../data.json'), { mergeWrites: true });
      return new BlobRecordProvider(context, { concurrentWrites: false });
    }
  }
}
