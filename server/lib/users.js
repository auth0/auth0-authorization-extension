import async from 'async';
import Promise from 'bluebird';

export function getUsersById(client, users, options) {
  return new Promise((resolve, reject) => {
    const records = [];

    async.eachLimit(users, 10, (userId, cb) => {
      users.get({ id: userId }, options)
        .then((user) => {
          records.push(user);
          cb();
        })
        .catch((err) => {
          if (err && err.errorCode === 'inexistent_user') {
            return cb();
          }

          return cb(err);
        });
    }, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(records);
    });
  });
}
