import config from '../../server/lib/config';

console.log('config', config('INT_AUTH0_CLIENT_SECRET'));

const request = require('request-promise');

let accessToken;

module.exports.credentials = {
  audience: 'urn:auth0-authz-api',
  client_id: config('INT_AUTH0_CLIENT_ID'),
  client_secret: config('INT_AUTH0_CLIENT_SECRET'),
  grant_type: 'client_credentials'
};

/*
 * Get an access token for the Authorization Extension API.
 */
module.exports.getAccessToken = () => {
  return request.post({ uri: `https://${config('INT_AUTH0_DOMAIN')}/oauth/token`, form: module.exports.credentials, json: true })
          .then(res => res.access_token).then((token) => {
            accessToken = token;
            return token;
          });
};

module.exports.authzApi = (endpoint) => (config('INT_AUTHZ_API_URL') + endpoint);
module.exports.token = () => ({ Authorization: `Bearer ${accessToken}` });
