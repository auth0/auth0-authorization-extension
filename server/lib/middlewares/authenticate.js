import nconf from 'nconf';
import jwt from 'express-jwt';

if (nconf.get('USE_OAUTH2')) {
  module.exports = jwt({
    secret: (req, payload, done) => {
      done(null, nconf.get('EXTENSION_SECRET'));
    }
  });
} else {
  module.exports = jwt({
    secret: new Buffer(nconf.get('AUTH0_CLIENT_SECRET'), 'base64'),
    audience: nconf.get('AUTH0_CLIENT_ID')
  });
}
