const exec = require('child_process').exec;
const logger = require('../server/lib/logger');

const getEnvironment = (env) => {
  if (process.platform === 'win32') {
    return `set NODE_ENV=${env}&&`;
  } else {
    return `NODE_ENV=${env}`;
  }
};

const command = `${getEnvironment(process.argv[2])} ${process.argv[3]}`;
logger.info('Executing:', command);

const proc = exec(command);
proc.stdout.on('data', (data) => {
  process.stdout.write(data);
});
proc.stderr.on('data', (data) => {
  process.stderr.write(data);
});
proc.on('error', (err) => {
  process.stderr.write(err);
});
