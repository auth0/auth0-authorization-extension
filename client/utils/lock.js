let _lock = null;

function getLock() {
  if (window.config.AUTH0_CLIENT_ID && !_lock) {
    _lock = new Auth0Lock(window.config.AUTH0_CLIENT_ID, window.config.AUTH0_DOMAIN);
  }

  return _lock;
}

export function getProfile(token, callback) {
  const lock = getLock();
  if (!lock) {
    return;
  }

  lock.$auth0.getProfile(token, callback);
}

export function parseHash(hash) {
  const lock = getLock();
  if (!lock) {
    return null;
  }

  return lock.parseHash(hash);
}

export function show(returnUrl) {
  const lock = getLock();
  if (!lock) {
    window.location.href = window.config.BASE_URL + '/login';
    return;
  }

  const origin = window.location.origin || window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

  lock.show({
    closable: false,
    responseType: 'token',
    callbackURL: `${origin}/login`,
    callbackOnLocationHash: true,
    authParams: {
      state: returnUrl
    }
  });
}
