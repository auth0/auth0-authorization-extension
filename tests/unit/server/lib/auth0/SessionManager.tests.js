import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { SigningKeyNotFoundError } from 'jwks-rsa';
import certs from '../../../mocks/certs.json';
import * as tokens from '../../../mocks/tokens';
import SessionManager from '../../../../../server/lib/auth0/SessionManager';
import { ArgumentError, ValidationError, UnauthorizedError } from '../../../../../server/lib/errors';

const tokenOptions = {
  secret: 'my-secret',
  issuer: 'https://app.bar.com',
  audience: 'urn:authz'
};

describe('SessionManager', () => {
  describe('#createAuthorizeUrl', () => {
    it('should return the authorize url', () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      const url = sessionManager.createAuthorizeUrl({
        nonce: 'nonce',
        redirectUri: 'http://foo.bar.com/login/callback'
      });

      const expectedUrl = 'https://auth0.auth0.com/authorize?client_id=http%3A%2F%2Ffoo.bar.com&' +
        'response_type=token%20id_token&response_mode=form_post&scope=' +
        'openid%20name%20email&expiration=36000&redirect_uri=http%3A%2F%2Ffoo.bar.com' +
        '%2Flogin%2Fcallback&audience=https%3A%2F%2Fme.auth0.local%2Fapi%2Fv2%2F&nonce=nonce';
      expect(url).to.equal(expectedUrl);
    });

    it('should set custom scopes', () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      const url = sessionManager.createAuthorizeUrl({
        redirectUri: 'http://foo.bar.com/login/callback',
        scopes: 'read:clients read:connections',
        nonce: 'nonce'
      });

      const expectedUrl = 'https://auth0.auth0.com/authorize?client_id=' +
        'http%3A%2F%2Ffoo.bar.com&response_type=token%20id_token' +
        '&response_mode=form_post&scope=' +
        'openid%20name%20email%20read%3Aclients%20read%3Aconnections' +
        '&expiration=36000&redirect_uri=http%3A%2F%2Ffoo.bar.com%2Flogin%2Fcallback' +
        '&audience=https%3A%2F%2Fme.auth0.local%2Fapi%2Fv2%2F&nonce=nonce';
      expect(url).to.equal(expectedUrl);
    });

    it('should set custom state', () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      const url = sessionManager.createAuthorizeUrl({
        redirectUri: 'http://foo.bar.com/login/callback',
        scopes: 'read:clients read:connections',
        nonce: 'nonce',
        state: 'state'
      });

      const expectedUrl = 'https://auth0.auth0.com/authorize?client_id=' +
        'http%3A%2F%2Ffoo.bar.com&response_type=token%20id_token' +
        '&response_mode=form_post&scope=' +
        'openid%20name%20email%20read%3Aclients%20read%3Aconnections' +
        '&expiration=36000&redirect_uri=http%3A%2F%2Ffoo.bar.com%2Flogin%2Fcallback' +
        '&audience=https%3A%2F%2Fme.auth0.local%2Fapi%2Fv2%2F&nonce=nonce&state=state';
      expect(url).to.equal(expectedUrl);
    });

    it('should reject bad state', () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');

      expect(() => {
        sessionManager.createAuthorizeUrl({
          redirectUri: 'http://foo.bar.com/login/callback',
          scopes: 'read:clients read:connections',
          nonce: 'nonce',
          state: ''
        });
      }).to.throw(ArgumentError);

      expect(() => {
        sessionManager.createAuthorizeUrl({
          redirectUri: 'http://foo.bar.com/login/callback',
          scopes: 'read:clients read:connections',
          nonce: 'nonce',
          state: null
        });
      }).to.throw(ArgumentError);
    });

    it('should set custom expiration', () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      const url = sessionManager.createAuthorizeUrl({
        redirectUri: 'http://foo.bar.com/login/callback',
        scopes: 'read:clients read:connections',
        nonce: 'nonce',
        expiration: 1
      });

      const expectedUrl = 'https://auth0.auth0.com/authorize?client_id=' +
        'http%3A%2F%2Ffoo.bar.com&response_type=token%20id_token' +
        '&response_mode=form_post&scope=' +
        'openid%20name%20email%20read%3Aclients%20read%3Aconnections' +
        '&expiration=1&redirect_uri=http%3A%2F%2Ffoo.bar.com%2Flogin%2Fcallback' +
        '&audience=https%3A%2F%2Fme.auth0.local%2Fapi%2Fv2%2F&nonce=nonce';
      expect(url).to.equal(expectedUrl);
    });
  });

  describe('#create', () => {
    it('validate options', async () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create('a', 'b', null);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ArgumentError);
      }
    });

    it('validate options.audience', async () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create('a', 'b', { audience: null, secret: 'foo', issuer: 'foo' });
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ArgumentError);
      }
    });

    it('validate options.audience length', async () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create('a', 'b', { audience: '', secret: 'foo', issuer: 'foo' });
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ArgumentError);
      }
    });

    it('validate options.issuer', async () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create('a', 'b', { audience: 'aa', secret: 'foo', issuer: null });
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ArgumentError);
      }
    });

    it('validate options.issuer length', async () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create('a', 'b', { audience: 'aa', secret: 'foo', issuer: '' });
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ArgumentError);
      }
    });

    it('validate options.secret', async () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create('a', 'b', { audience: 'aa', issuer: 'bb', secret: null });
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ArgumentError);
      }
    });

    it('validate options.secret length', async () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create('a', 'b', { audience: 'aa', issuer: 'bb', secret: '' });
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ArgumentError);
      }
    });

    it('should return error if id_token is null', async () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create();
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ArgumentError);
      }

      try {
        await sessionManager.create('');
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ArgumentError);
      }
    });

    it('should return error if id_token is invalid', async () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create('xyz', 'xyz', tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ValidationError);
      }
    });

    it('should return error if access_token is null', async () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create('x');
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ArgumentError);
      }

      try {
        await sessionManager.create('x', '');
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ArgumentError);
      }
    });

    it('should return error if access_token is invalid', async () => {
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create(tokens.sign(certs.bar.private, 'key1', { sub: 'foo' }), 'xyz', tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ValidationError);
      }
    });

    it('should return error if kid for id_token is invalid', async () => {
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');

      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      try {
        await sessionManager.create(tokens.sign(certs.bar.private, 'key1', { sub: 'foo' }), tokens.sign(certs.bar.private, 'key1', { sub: 'bar' }), tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.name).to.equal('SigningKeyNotFoundError');
      }
    });

    it('should return error if kid for access_token is invalid', async () => {
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');
      const sessionManager = new SessionManager('auth0.auth0.com', 'me.auth0.local', 'http://foo.bar.com');
      const idToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        aud: 'http://foo.bar.com',
        sub: 'foo'
      });
      const accessToken = tokens.sign(certs.bar.private, 'key1', { sub: 'bar' });  // invalid kid 'key1'
      try {
        await sessionManager.create(idToken, accessToken, tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(SigningKeyNotFoundError);
      }
    });

    it('should return error if iss of id_token is incorrect', async () => {
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');

      const idToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://othertenant.auth0.local/',
        aud: 'http://app.bar.com',
        sub: 'foo'
      });
      const accessToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        sub: 'bar',
        azp: 'http://app.bar.com',
        aud: [
          'https://auth0.auth0.com/userinfo',
          'https://bar.auth0.local/api/v2/'
        ]
      });

      const sessionManager = new SessionManager('auth0.auth0.com', 'bar.auth0.local', 'http://app.bar.com');
      try {
        await sessionManager.create(idToken, accessToken, tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message).to.equal('Invalid issuer: https://othertenant.auth0.local/');
        expect(err).to.be.instanceOf(UnauthorizedError);
      }
    });

    it('should return error if iss of access_token is incorrect', async () => {
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');

      const idToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        aud: 'http://app.bar.com',
        sub: 'foo'
      });
      const accessToken = tokens.sign(certs.bar.private, 'key2', { iss: 'https://foo2.auth0.local/', sub: 'bar' });

      const sessionManager = new SessionManager('auth0.auth0.com', 'bar.auth0.local', 'http://app.bar.com');
      try {
        await sessionManager.create(idToken, accessToken, tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message).to.equal('Invalid issuer: https://foo2.auth0.local/');
        expect(err).to.be.instanceOf(UnauthorizedError);
      }
    });

    it('should return error if aud of id_token is incorrect', async () => {
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');

      const idToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        aud: 'http://othertenant.bar.com',
        sub: 'foo'
      });
      const accessToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        sub: 'bar',
        aud: 'https://bar.auth0.local/api/v2/'
      });

      const sessionManager = new SessionManager('auth0.auth0.com', 'bar.auth0.local', 'http://app.bar.com');
      try {
        await sessionManager.create(idToken, accessToken, tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message).to.equal('Audience mismatch for: http://app.bar.com');
        expect(err).to.be.instanceOf(UnauthorizedError);
      }
    });

    it('should return error if aud of access_token is incorrect', async () => {
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');

      const idToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        aud: 'http://app.bar.com',
        sub: 'foo'
      });
      const accessToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        sub: 'bar',
        azp: 'http://app.bar.com',
        aud: [
          'https://auth0.auth0.com/userinfo',
          'https://othertenant.auth0.local/api/v2/'
        ]
      });

      const sessionManager = new SessionManager('auth0.auth0.com', 'bar.auth0.local', 'http://app.bar.com');
      try {
        await sessionManager.create(idToken, accessToken, tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message).to.equal('Audience mismatch for: https://bar.auth0.local/api/v2/');
        expect(err).to.be.instanceOf(UnauthorizedError);
      }
    });

    it('should return error if azp of access_token is incorrect', async () => {
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');

      const idToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        aud: 'http://app.bar.com',
        sub: 'foo'
      });
      const accessToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        sub: 'bar',
        azp: 'somethingelse',
        aud: [
          'https://auth0.auth0.com/userinfo',
          'https://bar.auth0.local/api/v2/'
        ]
      });

      const sessionManager = new SessionManager('auth0.auth0.com', 'bar.auth0.local', 'http://app.bar.com');
      try {
        await sessionManager.create(idToken, accessToken, tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message).to.equal('The access_token\'s azp does not match the id_token');
        expect(err).to.be.instanceOf(UnauthorizedError);
      }
    });

    it('should return error if subject of tokens do not match', async () => {
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');

      const idToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        aud: 'http://app.bar.com',
        sub: 'foo'
      });
      const accessToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        sub: 'bar',
        azp: 'http://app.bar.com',
        aud: [
          'https://auth0.auth0.com/userinfo',
          'https://bar.auth0.local/api/v2/'
        ]
      });

      const sessionManager = new SessionManager('auth0.auth0.com', 'bar.auth0.local', 'http://app.bar.com');
      try {
        await sessionManager.create(idToken, accessToken, tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message).to.equal('Subjects don\'t match');
        expect(err).to.be.instanceOf(UnauthorizedError);
      }
    });

    it('should return error if id token was issued by a different issuer', async () => {
      tokens.wellKnownEndpoint('rta.appliance.local', 'key2');
      tokens.wellKnownEndpoint('auth0.auth0.com', 'key2');

      const idToken = tokens.sign(certs.foo.private, 'key2', {
        iss: 'https://rta.appliance.local/',
        aud: 'http://app.bar.com',
        sub: 'foo'
      });
      const accessToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        sub: 'bar',
        azp: 'http://app.bar.com',
        aud: [
          'https://auth0.auth0.com/userinfo',
          'https://bar.auth0.local/api/v2/'
        ]
      });

      const sessionManager = new SessionManager('auth0.auth0.com', 'bar.auth0.local', 'http://app.bar.com');
      try {
        await sessionManager.create(idToken, accessToken, tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message).to.equal('invalid signature');
      }
    });

    it('should return error if access token was issued by a different issuer', async () => {
      tokens.wellKnownEndpoint('auth0.auth0.com', 'key2');
      tokens.wellKnownEndpoint('rta.appliance.local', 'key2');

      const idToken = tokens.sign(certs.foo.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        aud: 'http://app.bar.com',
        sub: 'foo'
      });
      const accessToken = tokens.sign(certs.foo.private, 'key2', {
        iss: 'https://rta.appliance.local/',
        sub: 'bar',
        azp: 'http://app.bar.com',
        aud: [
          'https://auth0.auth0.com/userinfo',
          'https://bar.auth0.local/api/v2/'
        ]
      });

      const sessionManager = new SessionManager('auth0.auth0.com', 'bar.auth0.local', 'http://app.bar.com');
      try {
        await sessionManager.create(idToken, accessToken, tokenOptions);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message).to.equal('invalid signature');
      }
    });

    it('should generate a session (api token)', async () => {
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');
      tokens.wellKnownEndpoint('auth0.auth0.com', 'bar', 'key2');

      const idToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        aud: 'http://app.bar.com',
        sub: 'google|me@example.com',
        exp: new Date().getTime(),
        email: 'me@example.com'
      });
      const accessToken = tokens.sign(certs.bar.private, 'key2', {
        iss: 'https://auth0.auth0.com/',
        sub: 'google|me@example.com',
        azp: 'http://app.bar.com',
        exp: new Date().getTime(),
        aud: [
          'https://auth0.auth0.com/userinfo',
          'https://bar.auth0.local/api/v2/'
        ]
      });

      const sessionManager = new SessionManager('auth0.auth0.com', 'bar.auth0.local', 'http://app.bar.com');
      const token = await sessionManager.create(idToken, accessToken, tokenOptions);
      expect(token).to.be.ok;

      const decoded = jwt.verify(token, tokenOptions.secret, { issuer: tokenOptions.issuer, audience: 'urn:authz' });
      expect(decoded).to.be.ok;
      expect(decoded.sub).to.equal('google|me@example.com');
      expect(decoded.email).to.equal('me@example.com');
      expect(decoded.access_token).to.equal(accessToken);
    });
  });
});
