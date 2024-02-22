import path from 'path';

export const register = async (server) => {
  server.route({
    method: 'GET',
    path: '/app/{param*}',
    config: {
      auth: false
    },
    handler: {
      directory: {
        path: path.join(__dirname, '../../dist'),
        redirectToSlash: true
      }
    }
  });
};


export const assetsPlugin = {
  register,
  name: 'assets'
};
