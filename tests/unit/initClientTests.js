import { JSDOM } from 'jsdom';
import auth0 from 'auth0-js';
import chai from 'chai';
import chaiMatch from 'chai-match';

chai.use(chaiMatch);

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop)
    }), {});
  Object.defineProperties(target, props);
}

/* Initialize configuration */
window.config = {
  AUTH0_DOMAIN: 'unitTesting.fakeAuth0.com',
  AUTH0_CLIENT_ID: 'fake-client-id'
};

global.auth0 = auth0;
global.window = window;
global.document = window.document;
global.self = window;
global.IS_REACT_ACT_ENVIRONMENT = true;

copyProps(window, global);
