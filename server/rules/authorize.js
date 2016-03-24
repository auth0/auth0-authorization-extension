function (user, context, callback) {
  var EXTENSION_URL = 'http://auth0-iam.herokuapp.com';

  authorizeUser(function(err, res, data) {
     if (err) {
      return callback(new Error(err));
    }

    console.log(data);
    if (!data.accessGranted) {
      return callback(
        new UnauthorizedError('You are not allowed to access this application.'));
    }

    user.groups = data.groups;
    return callback(null, user, context);
  });

  function authorizeUser(cb) {
    request.post({
      url: EXTENSION_URL + '/api/authorize/' + user.user_id,
      headers: {
        'x-api-key': 'abc'
      },
      json: {
        clientId: context.clientID,
        connectionName: context.connection,
        groups: user.groups
      },
      timeout: 5000
    }, cb);
  }
}
