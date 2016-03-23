function (user, context, callback) {
  var EXTENSION_URL = 'http://auth0-iam.herokuapp.com';

  // Authorize the user and process the result.
  authorizeUser(function(err, data) {
    if (err) {
      return callback(new Error(err));
    }

    // The current application is only accessible by specific groups.
    if (!data.accessGranted) {
      return callback(
        new UnauthorizedError('You are not allowed to access this application.'));
    }

    user.groups = data.groups;

    // Persist groups.
    user.app_metadata = user.app_metadata || {};
    user.app_metadata.groups = data.groups;
    return auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      .then(function() {
        callback(null, user, context);
      })
      .catch(function(err) {
        callback(err);
      });
  });

  // Call the extension to authorize the user.
  function authorizeUser(cb) {
    request.post({
      url: EXTENSION_URL + '/authorize/' + user.user_id,
      json: {
        clientId: context.clientID,
        connectionName: context.connection,
        groups: user.groups
      },
      timeout: 5000
    }, cb);
  }
}
