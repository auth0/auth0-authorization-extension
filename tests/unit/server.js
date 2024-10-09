import initHapiServer from '../../server';
import { init as initDb } from '../../server/lib/storage/getdb';


let server = null;
const db = {};

export const getServerData = async() => {
  initDb(db);

  if (!server) {
    server = await initHapiServer();
  }

  return { server, db };
};
