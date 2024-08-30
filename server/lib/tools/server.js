/* eslint-disable no-useless-escape */

const Boom = require('@hapi/boom');
const Request = require('request');
const tools = require('auth0-extension-tools');

module.exports.createServer = function(cb) {
  return fromHapi(tools.createServer(cb));
};

const SANITIZE_RX = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

function fromHapi(serverFactory) {
  var hapiServer;
  var webtaskContext;

  return async function(context, req, res) {
    webtaskContext = attachStorageHelpers(context);

    if (hapiServer == null) {
      hapiServer = await serverFactory(webtaskContext);

      if (!hapiServer) {
        throw new Error('Server factory did not return a server instance');
      }

      hapiServer.ext('onRequest', function(hapiRequest, h) {
        const normalizeRouteRx = createRouteNormalizationRx(hapiRequest.raw.req.x_wt);

        if (normalizeRouteRx) {
          hapiRequest.originalUrl = hapiRequest.path;
          // need to remove the protocol + domain etc for the route matching to work,
          // however, need to keep the query string for it to be passed to the route handlers
          hapiRequest.setUrl(`${hapiRequest.path}${hapiRequest.url.search}`.replace(normalizeRouteRx, '/'));
        }

        /* Fix multi-proto environments, take the first */
        if (hapiRequest.headers['x-forwarded-proto']) {
          hapiRequest.headers['x-forwarded-proto'] = hapiRequest.headers['x-forwarded-proto'].split(',').shift();
        }

        hapiRequest.webtaskContext = webtaskContext;

        return h.continue;
      });
    }

    const { method, url, query } = req;
    console.log({ method, url, query });

    hapiServer.listener.emit('request', req, res);
  };
}

const USE_WILDCARD_DOMAIN = 3;
const USE_CUSTOM_DOMAIN = 2;
const USE_SHARED_DOMAIN = 1;

function createRouteNormalizationRx(claims) {
  if (!claims.container) {
    return null;
  }

  const container = claims.container.replace(SANITIZE_RX, '\\$&');
  const name = claims.jtn
      ? claims.jtn.replace(SANITIZE_RX, '\\$&')
      : '';

  if (claims.url_format === USE_SHARED_DOMAIN) {
    return new RegExp('^\/api/run/' + container + '/(?:' + name + '\/?)?');
  } else if (claims.url_format === USE_CUSTOM_DOMAIN) {
    return new RegExp('^\/' + container + '/(?:' + name + '\/?)?');
  } else if (claims.url_format === USE_WILDCARD_DOMAIN) {
    return new RegExp('^\/(?:' + name + '\/?)?');
  }
  throw new Error('Unsupported webtask URL format.');
}

function attachStorageHelpers(context) {
  context.read = context.secrets.EXT_STORAGE_URL
      ? readFromPath
      : readNotAvailable;
  context.write = context.secrets.EXT_STORAGE_URL
      ? writeToPath
      : writeNotAvailable;

  return context;


  function readNotAvailable(path, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    cb(Boom.preconditionFailed('Storage is not available in this context'));
  }

  function readFromPath(path, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    Request({
      uri: context.secrets.EXT_STORAGE_URL,
      method: 'GET',
      headers: options.headers || {},
      qs: { path: path },
      json: true
    }, (err, res, body) => {
      if (err) return cb(Boom.boomify(err, 502));
      if (res.statusCode === 404 && Object.hasOwnProperty.call(options, 'defaultValue')) return cb(null, options.defaultValue);
      if (res.statusCode >= 400) return cb(Boom.create(res.statusCode, body && body.message));

      return cb(null, body);
    });
  }

  function writeNotAvailable(path, data, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    cb(Boom.preconditionFailed('Storage is not available in this context'));
  }

  function writeToPath(path, data, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    Request({
      uri: context.secrets.EXT_STORAGE_URL,
      method: 'PUT',
      headers: options.headers || {},
      qs: { path: path },
      body: data
    }, (err, res, body) => {
      if (err) return cb(Boom.boomify(err, 502));
      if (res.statusCode >= 400) return cb(Boom.create(res.statusCode, body && body.message));

      return cb(null);
    });
  }
}
