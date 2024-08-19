import { initHapiServer } from '../../server';
import { init as initDb } from '../../server/lib/storage/getdb';


let server = null;
const db = {};

// export const initServer = async () => {
//   initDb(db);

//   console.log('\n\n calling initHapiServer \n\n');
//   server = await initHapiServer();
//   console.log('\n\n set server \n\n');
// };

export const getServerData = async () => {
  initDb(db);

  if (!server) {
    server = await initHapiServer();
  }

  return { server, db };
};
