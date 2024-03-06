import { getDb } from '../lib/storage/getdb';

const register = async (server) => {
  const db = getDb();
  server.decorate('server', 'storage', db);
  server.decorate('request', 'storage', db);
};

export const storagePlugin = {
  register,
  name: 'storage'
};
