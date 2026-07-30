/* Written in CommonJS (no import/export) so mocha loads it via the babel-register
 * require hook rather than as a native ES module. That gives us require.cache,
 * which we need to re-import router.js under different window.config values —
 * its `basename` is computed once at module-load time. */
const path = require('path');
const expect = require('expect').default || require('expect');

const routerPath = path.resolve(process.cwd(), 'client/router.js');

const loadBasename = (basePath) => {
  delete require.cache[routerPath];
  global.window.config = { ...global.window.config, BASE_PATH: basePath };
  return require('../../../client/router').basename;
};

describe('client/router basename', () => {
  const originalConfig = { ...global.window.config };

  afterEach(() => {
    delete require.cache[routerPath];
    global.window.config = { ...originalConfig };
  });

  it('keeps a bare "/" base path as-is', () => {
    expect(loadBasename('/')).toBe('/');
  });

  it('strips a trailing slash from a nested base path', () => {
    expect(loadBasename('/authz/')).toBe('/authz');
  });

  it('leaves a nested base path without a trailing slash untouched', () => {
    expect(loadBasename('/authz')).toBe('/authz');
  });

  it('defaults to "/" when BASE_PATH is not configured', () => {
    delete require.cache[routerPath];
    global.window.config = { AUTH0_DOMAIN: 'x' };
    expect(require('../../../client/router').basename).toBe('/');
  });

  it('exposes navigateTo that delegates to the data router', () => {
    delete require.cache[routerPath];
    global.window.config = { ...originalConfig, BASE_PATH: '/' };
    const router = require('../../../client/router');
    const calls = [];
    router.router.navigate = to => calls.push(to);
    router.navigateTo('/users');
    expect(calls).toEqual([ '/users' ]);
  });
});
