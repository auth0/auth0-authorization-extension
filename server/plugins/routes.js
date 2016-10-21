module.exports.register = (server, options, next) => {
  server.route(require('../api/applications/routes/get_application')(server));
  server.route(require('../api/applications/routes/get_applications')(server));
  server.route(require('../api/configuration/routes/get_configuration_status')(server));
  server.route(require('../api/configuration/routes/get_configuration')(server));
  server.route(require('../api/configuration/routes/get_export')(server));
  server.route(require('../api/configuration/routes/post_import')(server));
  server.route(require('../api/configuration/routes/patch_configuration')(server));
  server.route(require('../api/connections/routes/get_connections')(server));
  server.route(require('../api/extension-hooks/routes/delete_uninstall')(server));
  server.route(require('../api/groups/routes/delete_group')(server));
  server.route(require('../api/groups/routes/get_group')(server));
  server.route(require('../api/groups/routes/get_groups')(server));
  server.route(require('../api/groups/routes/post_group')(server));
  server.route(require('../api/groups/routes/put_group')(server));
  server.route(require('../api/groups-mappings/routes/get_mappings')(server));
  server.route(require('../api/groups-mappings/routes/delete_mappings')(server));
  server.route(require('../api/groups-mappings/routes/patch_mappings')(server));
  server.route(require('../api/groups-members/routes/delete_members')(server));
  server.route(require('../api/groups-members/routes/get_members')(server));
  server.route(require('../api/groups-members/routes/get_nested_members')(server));
  server.route(require('../api/groups-members/routes/patch_members')(server));
  server.route(require('../api/groups-nested/routes/delete_nested_groups')(server));
  server.route(require('../api/groups-nested/routes/get_nested_groups')(server));
  server.route(require('../api/groups-nested/routes/patch_nested_groups')(server));
  server.route(require('../api/permissions/routes/delete_permission')(server));
  server.route(require('../api/permissions/routes/get_permission')(server));
  server.route(require('../api/permissions/routes/get_permissions')(server));
  server.route(require('../api/permissions/routes/post_permission')(server));
  server.route(require('../api/permissions/routes/put_permission')(server));
  server.route(require('../api/roles/routes/delete_role')(server));
  server.route(require('../api/roles/routes/get_role')(server));
  server.route(require('../api/roles/routes/get_roles')(server));
  server.route(require('../api/roles/routes/post_role')(server));
  server.route(require('../api/roles/routes/put_role')(server));
  server.route(require('../api/metadata/routes/get_metadata')(server));
  server.route(require('../api/users/routes/get_user')(server));
  server.route(require('../api/users/routes/get_users')(server));
  server.route(require('../api/users-groups/routes/get_users_groups')(server));
  next();
};

module.exports.register.attributes = {
  name: 'routes'
};
