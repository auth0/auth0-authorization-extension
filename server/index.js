import fs from 'fs';
import path from 'path';
import Express from 'express';
import bodyParser from 'body-parser';
import nconf from 'nconf';
import validator from 'validate.js';

import api from './routes/api';

// Initialize configuration.
nconf
  .file(path.join(__dirname, 'config.json'))
  .argv()
  .env()
  .defaults({
    NODE_ENV: 'development',
    PORT: 3000
  });

// Configure validator.
validator.options = { fullMessages: false };
validator.validators.presence.options = {
  message: (value, attribute) => {
    return `The ${attribute} is required.`;
  }
};

// Initialize the app.
const app = new Express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure routes.

app.use('/api', api());
app.use(Express.static(path.join(__dirname, '../assets')));
app.get('*', (req, res) => {
  fs.readFile(path.join(__dirname, '../assets/app/manifest.json'), 'utf8', (err, data) => {
    let locals = {
      config: {
        AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
        AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID')
      },
      assets: {
        app: 'bundle.js',
        style: 'bundle.css',
        vendors: 'vendor.js'
      }
    };

    if (!err && data) {
      locals.assets = JSON.parse(data);
    }

    return res.render('index', locals);
  });
});

console.log(`Starting server...`);

// Start the server.
const port = nconf.get('PORT');
app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Listening on http://localhost:${port}.`);
  }
});
