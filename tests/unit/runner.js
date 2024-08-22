import nconf from 'nconf';
import config from '../../server/lib/config';

import { wellKnownEndpoint } from './mocks/tokens';
import { auth0Client } from './mocks/auth0';

nconf
  .argv()
  .defaults({
    AUTH0_CLIENT_ID: '111',
    AUTH0_CLIENT_SECRET: '222',
    AUTH0_RTA: 'auth0.auth0.local',
    AUTH0_DOMAIN: 'foo.auth0.local',
    WT_URL: 'http://foo',
    EXTENSION_SECRET: 'abc',
    NODE_ENV: 'test',
    DATA_CACHE_MAX_AGE: 0,
    DUMMY_KEY: 'DUMMY_VALUE',
    PUBLIC_WT_URL: 'http://foo'
  });

config.setProvider((key) => nconf.get(key));


auth0Client();

wellKnownEndpoint(config('AUTH0_DOMAIN'), 'key2');
