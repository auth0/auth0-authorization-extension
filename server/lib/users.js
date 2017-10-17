import _ from 'lodash';
import async from 'async';
import Promise from 'bluebird';

export function getUsersById(client, ids, page, limit) {
  return new Promise((resolve, reject) => {
    const users = [];
    const total = ids.length;

    page = (page - 1 < 0) ? 0 : page - 1; // eslint-disable-line no-param-reassign
    ids = ids.splice(page * limit, limit); // eslint-disable-line no-param-reassign

    async.eachLimit(ids, 10, (userId, cb) => {
      client.users.get({ id: userId })
        .then((user) => {
          users.push(user);
          cb();
        })
        .catch((err) => {
          if (err && err.statusCode === 404) {
            users.push({
              user_id: userId,
              name: '<User Not Found>',
              email: userId,
              identities: [
                { connection: 'N/A' }
              ]
            });
            return cb();
          }

          return cb(err);
        });
    }, (err) => {
      if (err) {
        return reject(err);
      }

      const sorted = _.sortByOrder(users, 'user_id');

      return resolve({ total, users: sorted });
    });
  });
}
