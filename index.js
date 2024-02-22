const path = require('path');
const nconf = require('nconf');

const logger = require('./server/lib/logger');


// Initialize babel.
require('@babel/register')({
  ignore: [ /node_modules/ ],
  sourceMaps: !(process.env.NODE_ENV === 'production')
});
require('@babel/polyfill');


logger.info('=========== TIM:: in index.js');

// Initialize configuration.
nconf
  .argv()
  .env()
  .file(path.join(__dirname, './server/config.json'))
  .defaults({
    AUTH0_RTA: 'auth0.auth0.com',
    DATA_CACHE_MAX_AGE: 1000 * 10,
    NODE_ENV: 'development',
    HOSTING_ENV: 'default',
    PORT: 3001,
    USE_OAUTH2: false,
    LOG_COLOR: true
  });


// const getKey = (key) => {
//   const value = nconf.get(key);
//   console.log({ key, value });
// };


// const cfgFunction = ((key) => nconf.get(key), null, (err, hapi) => {
//   if (err) {
//     logger.error('cfgFunction error:');
//     if (err.stack) {
//       logger.error(err.stack);
//     }
//     if (err.message) {
//       logger.error(err.message);
//     }
//     if (err.details) {
//       logger.error(err.details);
//     }
//     return logger.error(err);
//   }
//   return hapi.start(() => {
//     logger.info('=========== TIM:: in index.js - callback - hapi has started');
//     logger.info('Server running at:', hapi.info.uri);
//   });
// });


// const init = async () => {
//   const hapi = await require('./server/init').default(cfgFunction);

//   await hapi.start();
//   logger.info(`Server running on ${hapi.info.uri}`);
// };

// process.on('unhandledRejection', (err) => {
//   logger.error(err);
//   if (err.stack) {
//     logger.error(err.stack);
//   }

//   process.exit(1);
// });

// init();


// Start the server.
return require('./server/init').default((key) => nconf.get(key), null, (err, hapi) => {
  logger.info('=========== TIM:: in index.js - callback - callback');
  if (err) {
    if (err.stack) {
      logger.error(err.stack);
    }
    return logger.error(err);
  }

  logger.info('=========== TIM:: in index.js - callback - hapi should start started');

  return hapi.start(() => {
    logger.info('=========== TIM:: in index.js - callback - hapi has started');
    logger.info('Server running at:', hapi.info.uri);
  });
});
