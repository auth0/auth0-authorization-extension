module.exports.register = (server, options, next) => {
  server.decorate('server', 'handlers', {
    managementClient: require('../handlers/managementClient'),
    validateHookToken: require('../handlers/validateHookToken')
  });

  next();
};

module.exports.register.attributes = {
  name: 'handlers'
};
