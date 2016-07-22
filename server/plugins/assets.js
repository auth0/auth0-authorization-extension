import path from 'path';

module.exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/app/{param*}',
    config: {
      auth: false
    },
    handler: {
      directory: {
        path: path.join(__dirname, '../../dist'),
        redirectToSlash: true
      }
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'assets'
};
