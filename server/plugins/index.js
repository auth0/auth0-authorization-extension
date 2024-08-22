const { authPlugin } = require('./auth');
const { assetsPlugin } = require('./assets');
const { handlersPlugin } = require('./handlers');
const { htmlPlugin } = require('./html');
const { routesPlugin } = require('./routes');
const { responseDecoratorsPlugin } = require('./response-decorators');
const { storagePlugin } = require('./storage');

const plugins = [
  authPlugin,
  assetsPlugin,
  handlersPlugin,
  htmlPlugin,
  routesPlugin,
  responseDecoratorsPlugin,
  storagePlugin
];

module.exports = plugins;
