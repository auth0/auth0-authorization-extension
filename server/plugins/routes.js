import _ from 'lodash';
import config from '../lib/config';

const register = (server) => {
  const routes = [
    require('../api/policy/routes/post_user').default(server),
    require('../api/applications/routes/get_application').default(server),
    require('../api/applications/routes/get_applications').default(server),
    require('../api/configuration/routes/get_configuration_status').default(server),
    require('../api/configuration/routes/get_configuration').default(server),
    require('../api/configuration/routes/get_export').default(server),
    require('../api/configuration/routes/post_import').default(server),
    require('../api/configuration/routes/patch_configuration').default(server),
    require('../api/configuration/routes/patch_apikey').default(server),
    require('../api/configuration/routes/get_apiaccess').default(server),
    require('../api/configuration/routes/patch_apiaccess').default(server),
    require('../api/configuration/routes/post_apiaccess').default(server),
    require('../api/configuration/routes/delete_apiaccess').default(server),
    require('../api/connections/routes/get_connections').default(server),
    require('../api/extension-hooks/routes/delete_uninstall').default(server),
    require('../api/extension-hooks/routes/put_update').default(server),
    require('../api/permissions/routes/delete_permission').default(server),
    require('../api/permissions/routes/get_permission').default(server),
    require('../api/permissions/routes/get_permissions').default(server),
    require('../api/permissions/routes/post_permission').default(server),
    require('../api/permissions/routes/put_permission').default(server),
    require('../api/roles/routes/delete_role').default(server),
    require('../api/roles/routes/get_role').default(server),
    require('../api/roles/routes/get_roles').default(server),
    require('../api/roles/routes/post_role').default(server),
    require('../api/roles/routes/put_role').default(server),
    require('../api/groups/routes/delete_group').default(server),
    require('../api/groups/routes/get_group').default(server),
    require('../api/groups/routes/get_groups').default(server),
    require('../api/groups/routes/post_group').default(server),
    require('../api/groups/routes/put_group').default(server),
    require('../api/groups-roles/routes/delete_roles').default(server),
    require('../api/groups-roles/routes/get_roles').default(server),
    require('../api/groups-roles/routes/get_nested_roles').default(server),
    require('../api/groups-roles/routes/patch_roles').default(server),
    require('../api/groups-nested/routes/delete_nested_groups').default(server),
    require('../api/groups-nested/routes/get_nested_groups').default(server),
    require('../api/groups-nested/routes/patch_nested_groups').default(server),
    require('../api/groups-mappings/routes/get_mappings').default(server),
    require('../api/groups-mappings/routes/delete_mappings').default(server),
    require('../api/groups-mappings/routes/patch_mappings').default(server),
    require('../api/groups-members/routes/delete_members').default(server),
    require('../api/groups-members/routes/get_members').default(server),
    require('../api/groups-members/routes/get_nested_members').default(server),
    require('../api/groups-members/routes/patch_members').default(server),
    require('../api/metadata/routes/get_metadata').default(server),
    require('../api/users/routes/get_user').default(server),
    require('../api/users/routes/get_users').default(server),
    require('../api/users-groups/routes/get_users_groups').default(server),
    require('../api/users-groups/routes/get_users_groups_calculate').default(server),
    require('../api/users-groups/routes/patch_user_add_to_group').default(server),
    require('../api/users-roles/routes/get_users_roles').default(server),
    require('../api/users-roles/routes/get_users_roles_calculate').default(server),
    require('../api/users-roles/routes/delete_user_remove_from_roles').default(server),
    require('../api/users-roles/routes/patch_user_add_to_roles').default(server)
  ];

  // can't set server.validate.failAction globally any more; must be set per route
  // this fail action allows for more specific validation errors to be returned, naming fields that failed validation
  routes.forEach(route => {
    const routeWithFailAction = _.set(route, 'options.validate.failAction', async (request, h, err) => err);
    server.route(routeWithFailAction);
  });

  server.route({
    method: 'GET',
    path: '/admins/login',
    options: { auth: false },
    handler: (request, h) => h.response('Redirecting to login page...').redirect(`${config('PUBLIC_WT_URL')}/login`)
  });
};

export const routesPlugin = {
  register,
  name: 'routes'
};
