import nock from 'nock';
import jwt from 'jsonwebtoken';
import certs from './certs.json';
import config from '../../../server/lib/config';

const cert = certs.test;

module.exports.wellKnownEndpoint = (domain, kid) =>
   nock(`https://${domain}`)
    .get('/.well-known/jwks.json')
    .reply(200, {
      keys: [
        {
          alg: 'RS256',
          use: 'sig',
          kty: 'RSA',
          x5c: [ cert.cert.match(/-----BEGIN CERTIFICATE-----([\s\S]*)-----END CERTIFICATE-----/i)[1].replace('\n', '') ],
          kid,
          n: cert.modulus,
          e: cert.exponent,
          x5t: cert.fingerprint
        }
      ]
    })
;

module.exports.sign = (certArg, kid, payload) =>
   jwt.sign(payload, certArg, { header: { kid }, algorithm: 'RS256' })
;

module.exports.getToken = (scope) =>
   module.exports.sign(cert.privateKey, 'key2', {
     iss: `https://${config('AUTH0_DOMAIN')}/`,
     aud: 'urn:auth0-authz-api',
     sub: '123456@clients',
     scope
   })
;

module.exports.getUserToken = (scope) =>
   module.exports.sign(cert.privateKey, 'key2', {
     iss: `https://${config('AUTH0_DOMAIN')}/`,
     aud: 'urn:auth0-authz-api',
     sub: 'auth0|aaaaaaaaa',
     azp: '123',
     scope
   })
;

module.exports.getAdminTokenWithoutAccessToken = (scope) =>
  jwt.sign({
    iss: 'http://foo',
    aud: 'urn:api-authz',
    sub: 'auth0|aaaaaaaaa',
    azp: '123',
    scope
  }, 'abc')
;

module.exports.getApiToken = (gty, sub, scope) =>
  module.exports.sign(cert.privateKey, 'key2', {
    iss: `https://${config('AUTH0_DOMAIN')}/`,
    aud: 'urn:auth0-authz-api',
    sub: `auth0@${sub}`,
    azp: '123',
    gty,
    scope
  })
;
