import config from '../../server/lib/config';

const request = require('request-promise');

export const credentials = {
  audience: 'urn:auth0-authz-api',
  client_id: config('AUTH0_CLIENT_ID'),
  client_secret: config('AUTH0_CLIENT_SECRET'),
  grant_type: 'client_credentials'
};

/*
 * Get an access token for the Authorization Extension API.
 */
export const getAccessToken = async () => {
  const result = await request.post({
    uri: `https://${config('AUTH0_DOMAIN')}/oauth/token`,
    form: credentials,
    json: true
  });

  return result.access_token;
};

export const authzApi = (endpoint) => (config('AUTHZ_API_URL') + endpoint);
export const token = (accessToken) => ({ Authorization: `Bearer ${accessToken}` });
export const extensionApiKey = config('EXTENSION_SECRET');

// Splits an array into chunked sub-arrays.
export const chunks = (array, size) => {
  const items = [ ...array ];
  const results = [];
  while (items.length) {
    results.push(items.splice(0, size));
  }
  return results;
};
