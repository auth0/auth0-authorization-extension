import qs from 'qs';
import jwtDecode from 'jwt-decode';

export function parseHash(hash) {
  let hashFragement = hash || window.location.hash;

  let parsedHash;
  if (hashFragement.match(/error/)) {
    hashFragement = hashFragement.substr(1).replace(/^\//, '');
    parsedHash = qs.parse(hashFragement);

    return {
      error: parsedHash.error,
      errorDescription: parsedHash.error_description
    };
  }

  hashFragement = hashFragement.substr(1).replace(/^\//, '');
  parsedHash = qs.parse(hashFragement);

  return {
    accessToken: parsedHash.access_token,
    idToken: parsedHash.id_token,
    refreshToken: parsedHash.refresh_token,
    state: parsedHash.state
  };
}

export function isTokenExpired(decodedToken) {
  if (typeof decodedToken.exp === 'undefined') {
    return true;
  }

  const d = new Date(0);
  d.setUTCSeconds(decodedToken.exp);

  return !(d.valueOf() > (new Date().valueOf() + (1000)));
}

export function decodeToken(token) {
  return jwtDecode(token);
}
