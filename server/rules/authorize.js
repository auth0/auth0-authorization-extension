module.exports = (extensionUrl, apiKey) => {
  return `function (user, context, callback) {
    var EXTENSION_URL = "${extensionUrl}";

    // Store authorization data in the user profile so we can query it later.
    var persistUserData = function(user, groups, roles, permissions, cb) {
      user.app_metadata = user.app_metadata || {};
      user.app_metadata.authorization = {
        groups: groups,
        roles: roles,
        permissions: permissions
      };

      auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      .then(function() {
        cb();
      })
      .catch(function(err){
        cb(err);
      });
    };

    // Authorize the user.
    var authorizeUser = function(user, context, cb) {
      request.post({
        url: EXTENSION_URL + "/api/authorize/" + user.user_id,
        headers: {
          "x-api-key": "${apiKey}"
        },
        json: {
          clientId: context.clientID,
          connectionName: context.connection,
          groups: user.groups
        },
        timeout: 5000
      }, cb);
    };

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

      // Update the outgoing token.
      user.groups = data.groups;
      user.roles = data.roles;
      user.permissions = data.permissions;

      // Store this in the user profile.
      persistUserData(user, data.groups, data.roles, data.permissions, function(err) {
        return callback(null, user, context);
      });
    });
  }`;
};
