module.exports.register = (server, options, next) => {
  server.route(require('../api/applications/routes/get_application')(server));
  server.route(require('../api/applications/routes/get_applications')(server));
  server.route(require('../api/configuration/routes/get_configuration')(server));
  server.route(require('../api/configuration/routes/get_configuration_status')(server));
  server.route(require('../api/configuration/routes/patch_configuration')(server));
  server.route(require('../api/connections/routes/get_connections')(server));
  server.route(require('../api/extension-hooks/routes/delete_uninstall')(server));
  server.route(require('../api/groups/routes/delete_group')(server));
  server.route(require('../api/groups/routes/get_group')(server));
  server.route(require('../api/groups/routes/get_groups')(server));
  server.route(require('../api/groups/routes/post_group')(server));
  server.route(require('../api/groups/routes/put_group')(server));
  server.route(require('../api/metadata/routes/get_metadata')(server));

  next();
};

module.exports.register.attributes = {
  name: 'routes'
};
