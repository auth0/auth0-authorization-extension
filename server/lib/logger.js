const winston = require('winston');

const logger = new winston.createLogger({
  // handleExceptions: true,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      // timestamp: true,
      level: 'debug',
      // handleExceptions: true,
      json: false
      // colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
