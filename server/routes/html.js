import fs from 'fs';
import path from 'path';
import nconf from 'nconf';

export default () => {
  return (req, res) => {
    fs.readFile(path.join(__dirname, '../assets/app/manifest.json'), 'utf8', (err, data) => {
      let locals = {
        config: {
          AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
          AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID')
        },
        assets: {
          app: 'bundle.js',
          style: 'bundle.css',
          vendors: 'vendors.js'
        }
      };

      if (!err && data) {
        locals.assets = JSON.parse(data);
      }

      return res.render('index', locals);
    });
  };
};
