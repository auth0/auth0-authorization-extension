import path from 'path';
import nconf from 'nconf';
import config from '../server/lib/config';
import { initServer } from './server';
import { generateToken } from './token';

nconf
  .argv()
  .env()
  .file(path.join(__dirname, '../server/config.json'))
  .defaults({
    AUTH0_DOMAIN: 'foo.auth0.com',
    WT_URL: 'http://foo',
    EXTENSION_SECRET: 'abc',
    NODE_ENV: 'test',
    DATA_CACHE_MAX_AGE: 0,
    DUMMY_KEY: 'DUMMY_VALUE'
  });

config.setProvider((key) => nconf.get(key));

initServer();
generateToken();
