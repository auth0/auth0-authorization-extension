import Hapi from 'hapi';

import plugins from './plugins';

export default (cb) => {
  const server = new Hapi.Server({ debug: { log: [ 'error' ] } });
  server.connection({ port: 4201 });
  server.register(plugins, (err) => {
    if (err) {
      return cb(err, null);
    }

    return cb(null, server);
  });
};
