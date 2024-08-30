const winston = require('winston');

const logger = new winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: 'debug',
      json: false
    })
  ],
  exitOnError: false
});

module.exports = logger;
