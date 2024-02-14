const winston = require('winston');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: true,
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
