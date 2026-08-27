import nconf from 'nconf';
import config from '../../server/lib/config';

// developer's shell cannot silently override the test tenant's credentials.
nconf
  .argv()
  .file({ file: `${__dirname}/config.json` })
  .env()
  .defaults({
    "DATA_CACHE_MAX_AGE": 0
  });

const missing = [ 'AUTH0_DOMAIN', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET' ]
  .filter((key) => !nconf.get(key));

if (missing.length) {
  throw new Error(
    `Missing integration test config: ${missing.join(', ')}.\n` +
    'Copy tests/integration/config.example.json to tests/integration/config.json ' +
    'and fill in credentials for the tenant you are testing against.'
  );
}

config.setProvider((key) => nconf.get(key));
