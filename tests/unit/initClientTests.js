import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { JSDOM } from 'jsdom';
import auth0 from 'auth0-js';
import chai from 'chai';
import chaiMatch from 'chai-match';

chai.use(chaiMatch);

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
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
global.navigator = {
  userAgent: 'node.js'
};
global.self = { navigator: global.navigator };

copyProps(window, global);

configure({ adapter: new Adapter() });
