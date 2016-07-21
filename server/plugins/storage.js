import { getDb } from '../lib/storage/getdb';

module.exports.register = (server, options, next) => {
  const db = getDb();
  server.decorate('server', 'storage', db);
  server.decorate('request', 'storage', db);

  next();
};

module.exports.register.attributes = {
  name: 'storage'
};
