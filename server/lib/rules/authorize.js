module.exports = `function (user, context, callback) {
  var _ = require('lodash');
  var EXTENSION_URL = "<%= extensionUrl %>";

  // Reach out to the extension.
  authorizeUser(user, context, function(err, res, data) {
     if (err) {
      return callback(new Error(err));
    }

    // Access denied.
    if (!data.accessGranted) {
      console.log('Access Denied:', data);
      return callback(
        new UnauthorizedError("You are not allowed to access this application."));
    }

    // Update the outgoing token.<% if (config.groupsInToken && !config.groupsPassthrough) { %>
    user.groups = data.groups;<% } %><% if (config.groupsInToken && config.groupsPassthrough) { %>
    user.groups = mergeGroups(user.groups, data.groups);<% } %><% if (config.rolesInToken) { %>
    user.roles = data.roles;<% } %><% if (config.permissionsInToken) { %>
    user.permissions = data.permissions;<% } %>
<% if (config.persistGroups || config.persistRoles || config.persistPermissions) { %>
    // Store this in the user profile.
    saveToMetadata(user, data.groups, data.roles, data.permissions, function(err) {
      return callback(null, user, context);
    });
<% } %>  });

  // Authorize the user.
  function authorizeUser(user, context, cb) {
    request.post({
      url: EXTENSION_URL + "/api/authorize/" + user.user_id,
      headers: {
        "x-api-key": "<%= apiKey %>"
      },
      json: {
        clientId: context.clientID,
        connectionName: context.connection,
        groups: user.groups
      },
      timeout: 5000
    }, cb);
  }<% if (config.persistGroups || config.persistRoles || config.persistPermissions) { %>

  // Store authorization data in the user profile so we can query it later.
  function saveToMetadata(user, groups, roles, permissions, cb) {
    user.app_metadata = user.app_metadata || {};
    user.app_metadata.authorization = {<% if (config.persistGroups && !config.groupsPassthrough) { %>
      groups: groups,<% } %><% if (config.persistGroups && config.groupsPassthrough) { %>
      groups: mergeGroups(user.groups, groups),<% } %><% if (config.persistRoles) { %>
      roles: roles,<% } %><% if (config.persistPermissions) { %>
      permissions: permissions<% } %>
    };

    auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
    .then(function() {
      cb();
    })
    .catch(function(err){
      cb(err);
    });
  }<% } %><% if (config.groupsInToken && config.groupsPassthrough) { %>

  // Merge the IdP groups with the groups of the extension.
  function mergeGroups(idpGroups, extensionGroups) {
    idpGroups = idpGroups || [ ];
    extensionGroups = extensionGroups || [ ];

    return _.uniq(_.union(idpGroups, extensionGroups));
  }<% } %>
}`;
