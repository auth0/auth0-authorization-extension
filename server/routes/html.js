import fs from 'fs';
import path from 'path';
import nconf from 'nconf';

import logger from '../lib/logger';

export default () => {
  return (req, res, next) => {
    if (req.url.indexOf('/api') === 0) return next();

    logger.debug('Reading JSON file:', path.join(__dirname, '../assets/app/manifest.json'));

    fs.readFile(path.join(__dirname, '../../assets/app/manifest.json'), 'utf8', (err, data) => {
      let locals = {
        config: {
          AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
          AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID')
        },
        assets: {
          app: 'bundle.js'
        }
      };

      if (!err && data) {
        locals.assets = JSON.parse(data);
      } else if (err) {
        logger.error(err);
      }

      return res.render('index', locals);
    });
  };
};
