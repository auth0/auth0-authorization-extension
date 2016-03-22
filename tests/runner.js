import path from 'path';
import nconf from 'nconf';

nconf
  .argv()
  .env()
  .file(path.join(__dirname, '../server/config.json'))
  .defaults({
    NODE_ENV: 'test',
    DATA_CACHE_MAX_AGE: 0
  });
