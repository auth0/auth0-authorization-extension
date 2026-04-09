const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const crypto = require('crypto');
const { URLSearchParams } = require('url');

const ArgumentError = require('../errors').ArgumentError;
const UnauthorizedError = require('../errors').UnauthorizedError;
const ValidationError = require('../errors').ValidationError;

function SessionManager(rta, domain, clientId) {
  if (rta === null || rta === undefined) {
    throw new ArgumentError('Must provide a valid domain');
  }

  if (typeof rta !== 'string' || rta.length === 0) {
    throw new ArgumentError('The provided rta is invalid: ' + rta);
  }

  if (rta.indexOf('https://') === 0) {
    rta = rta.replace('https://', '');
  }

  if (domain === null || domain === undefined) {
    throw new ArgumentError('Must provide a valid domain');
  }

  if (typeof domain !== 'string' || domain.length === 0) {
    throw new ArgumentError('The provided domain is invalid: ' + domain);
  }

  if (clientId === null || clientId === undefined) {
    throw new ArgumentError('Must provide a valid clientId');
  }

  if (typeof clientId !== 'string' || clientId.length === 0) {
    throw new ArgumentError('The provided clientId is invalid: ' + clientId);
  }

  this.options = {
    rta: rta,
    domain: domain,
    clientId: clientId
  };

  this.jwksClient = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: 'https://' + rta + '/.well-known/jwks.json'
  });
  this.managementApiAudience = 'https://' + domain + '/api/v2/';
}

SessionManager.prototype.createAuthorizeUrl = function(options) {
  if (options === null || options === undefined) {
    throw new ArgumentError('Must provide the options');
  }

  if (options.redirectUri === null || options.redirectUri === undefined) {
    throw new ArgumentError('Must provide the redirectUri');
  }

  if (options.nonce === null || options.nonce === undefined) {
    // TODO: throw new ArgumentError('Must provide the nonce');
    options.nonce = crypto.randomBytes(16).toString('hex');
  } else if (typeof options.nonce !== 'string' || options.nonce.length === 0) {
    throw new ArgumentError('The provided nonce is invalid: ' + options.nonce);
  }

  if (typeof options.redirectUri !== 'string' || options.redirectUri.length === 0) {
    throw new ArgumentError('The provided redirectUri is invalid: ' + options.redirectUri);
  }

  if (options.state !== undefined && (typeof options.state !== 'string' || options.state.length === 0)) {
    throw new ArgumentError('The provided state is invalid: ' + options.state);
  }

  let scopes = 'openid name email';
  if (options.scopes && options.scopes.length) {
    scopes += ' ' + options.scopes;
  }

  const params = new URLSearchParams({
    client_id: this.options.clientId,
    response_type: 'token id_token',
    response_mode: 'form_post',
    scope: scopes,
    expiration: options.expiration || 36000,
    redirect_uri: options.redirectUri,
    audience: this.managementApiAudience,
    nonce: options.nonce,
    ...(options.state && { state: options.state })
  });

  return `https://${this.options.rta}/authorize?${params}`
    .toString()
    .replaceAll('+', '%20');
};

SessionManager.prototype.validateToken = function(client, audience, token) {
  const self = this;
  return new Promise(function(resolve, reject) {
    const decoded = jwt.decode(token, { complete: true });
    if (decoded == null) {
      return reject(new ValidationError('Unable to decoded the token.'));
    }

    return self.jwksClient.getSigningKey(decoded.header.kid, function(signingKeyError, key) {
      if (signingKeyError) {
        return reject(signingKeyError);
      }

      const signingKey = key.publicKey || key.rsaPublicKey;
      return jwt.verify(token, signingKey, { algorithms: [ 'RS256' ] }, function(err, payload) {
        if (err) {
          return reject(err);
        }

        if (payload.iss !== 'https://' + self.options.rta + '/') {
          return reject(new UnauthorizedError('Invalid issuer: ' + payload.iss));
        }

        if (!(payload && (payload.aud === audience
            || (Array.isArray(payload.aud) && payload.aud.indexOf(audience) > -1)))) {
          return reject(new UnauthorizedError('Audience mismatch for: ' + audience));
        }

        return resolve(payload);
      });
    });
  });
};

/**
 * Create a new session.
 */
SessionManager.prototype.create = function(idToken, accessToken, options) {
  if (idToken === null || idToken === undefined) {
    return Promise.reject(new ArgumentError('Must provide an id_token'));
  }

  if (typeof idToken !== 'string' || idToken.length === 0) {
    return Promise.reject(new ArgumentError('The provided id_token is invalid: ' + idToken));
  }

  if (accessToken === null || accessToken === undefined) {
    return Promise.reject(new ArgumentError('Must provide an access_token'));
  }

  if (typeof accessToken !== 'string' || accessToken.length === 0) {
    return Promise.reject(new ArgumentError('The provided access_token is invalid: ' + accessToken));
  }

  if (options === null || options === undefined) {
    return Promise.reject(new ArgumentError('Must provide the options'));
  }

  if (options.secret === null || options.secret === undefined) {
    return Promise.reject(new ArgumentError('Must provide the secret'));
  }

  if (typeof options.secret !== 'string' || options.secret.length === 0) {
    return Promise.reject(new ArgumentError('The provided secret is invalid: ' + options.secret));
  }

  if (options.audience === null || options.audience === undefined) {
    return Promise.reject(new ArgumentError('Must provide the audience'));
  }

  if (typeof options.audience !== 'string' || options.audience.length === 0) {
    return Promise.reject(new ArgumentError('The provided audience is invalid: ' + options.audience));
  }

  if (options.issuer === null || options.issuer === undefined) {
    return Promise.reject(new ArgumentError('Must provide the issuer'));
  }

  if (typeof options.issuer !== 'string' || options.issuer.length === 0) {
    return Promise.reject(new ArgumentError('The provided issuer is invalid: ' + options.issuer));
  }

  const self = this;
  return Promise.all([
    self.validateToken(self.options.clientId, self.options.clientId, idToken),
    self.validateToken(self.options.clientId, self.managementApiAudience, accessToken)
  ])
    .then(function(tokens) {
      if (tokens[1].azp !== self.options.clientId) {
        return Promise.reject(new UnauthorizedError('The access_token\'s azp does not match the id_token'));
      }

      if (tokens[0].sub !== tokens[1].sub) {
        return Promise.reject(new UnauthorizedError('Subjects don\'t match'));
      }

      const payload = {
        sub: tokens[0].sub,
        email: tokens[0].email,
        exp: tokens[0].exp
      };

      if (!options.noAccessToken) {
        payload.access_token = accessToken;
      }

      return jwt.sign(payload, options.secret, {
        algorithm: 'HS256',
        issuer: options.issuer,
        audience: options.audience
      });
    });
};

module.exports = SessionManager;
