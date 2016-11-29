const settings = { };
let currentProvider = null;

const config = (key) => {
  if (settings && settings[key]) {
    return settings[key];
  }

  if (!currentProvider) {
    throw new Error('A configuration provider has not been set');
  }

  return currentProvider(key);
};

config.setProvider = (providerFunction) => {
  currentProvider = providerFunction;
};

config.setValue = (key, value) => {
  settings[key] = value;
};

module.exports = config;
