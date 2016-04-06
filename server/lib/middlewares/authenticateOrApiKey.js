import nconf from 'nconf';
import authenticate from './authenticate';

module.exports = (req, res, next) => {
  const header = req.headers['x-api-key'];
  if (header && header === nconf.get('AUTHORIZE_API_KEY')) {
    req.user = {
      name: 'auth0-rule'
    };
    return next();
  }

  return authenticate(req, res, next);
};
