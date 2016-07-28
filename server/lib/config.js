import nconf from 'nconf';

let provider = null;
export const setProvider = (providerFunction) => {
  provider = providerFunction;
};

export default (key) => {
  if (provider) {
    return provider(key);
  }

  return nconf.get(key);
};
