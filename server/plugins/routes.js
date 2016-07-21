module.exports.register = (server, options, next) => {
  server.route(require('./routes/delete_hook-uninstall')(server));
  server.route(require('./routes/get_connections')(server));
  server.route(require('./routes/get_configuration')(server));
  server.route(require('./routes/get_meta')(server));

  next();
};

module.exports.register.attributes = {
  name: 'routes'
};
