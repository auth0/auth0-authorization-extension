module.exports = (extensionUrl, apiKey) => {
  let rule = [
    'function (user, context, callback) {',
    `  var EXTENSION_URL = "${extensionUrl}";`,
    '',
    '  authorizeUser(function(err, res, data) {',
    '     if (err) {',
    '      return callback(new Error(err));',
    '    }',
    '',
    '    if (!data.accessGranted) {',
    '      return callback(',
    '        new UnauthorizedError("You are not allowed to access this application."));',
    '    }',
    '',
    '    user.groups = data.groups;',
    '    return callback(null, user, context);',
    '  });',
    '',
    '  function authorizeUser(cb) {',
    '    request.post({',
    '      url: EXTENSION_URL + "/api/authorize/" + user.user_id,',
    '      headers: {',
    `        "x-api-key": "${apiKey}"`,
    '      },',
    '      json: {',
    '        clientId: context.clientID,',
    '        connectionName: context.connection,',
    '        groups: user.groups',
    '      },',
    '      timeout: 5000',
    '    }, cb);',
    '  }',
    '}'
  ].join('\n');

  return rule;
}
