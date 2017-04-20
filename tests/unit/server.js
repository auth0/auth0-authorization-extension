import createServer from '../../server';
import { init as initDb } from '../../server/lib/storage/getdb';


let server = null;
const db = {};

export const initServer = () => {
  initDb(db);

  createServer((err, s) => {
    server = s;
  });
};

export const getServerData = () => {
  if (!server) throw new Error('No server created');
  return { server, db };
};
