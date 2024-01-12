import config from '../../server/lib/config';

const request = require('request-promise');

let accessToken;

export const credentials = {
  audience: 'urn:auth0-authz-api',
  client_id: config('AUTH0_CLIENT_ID'),
  client_secret: config('AUTH0_CLIENT_SECRET'),
  grant_type: 'client_credentials'
};

/*
 * Get an access token for the Authorization Extension API.
 */
export const getAccessToken = () => {
  const uri = `https://${config('AUTH0_DOMAIN')}/oauth/token`;
  const postOptions = {
    uri,
    form: credentials,
    json: true
  };

  console.log(`getAccessToken start, calling ${uri}`);
  return request.post(postOptions)
  .then(res => {
    console.log('getAccessToken after first promise');
    const newAccessToken = res.access_token;
    return newAccessToken;
  }).then((token) => {
    console.log('getAccessToken after second promise');
    accessToken = token;
    return token;
  })
  .catch(err => {
    console.error(err);
    throw err;
  });
};


export const authzApi = (endpoint) => (config('AUTHZ_API_URL') + endpoint);
export const token = () => ({ Authorization: `Bearer ${accessToken}` });
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
