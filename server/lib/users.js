import async from 'async';
import Promise from 'bluebird';

const getLinkedUserByOldId = (client, userId) =>
  client.users.getAll({
    q: `identities.user_id=${userId.split('|')[1] || userId}`,
    per_page: 1,
    search_engine: 'v2'
  });

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
            return getLinkedUserByOldId(client, userId)
              .then(user => {
                if (user && user[0]) {
                  users.push(user[0]);
                } else {
                  users.push({
                    user_id: userId,
                    name: '<User Not Found>',
                    email: userId,
                    identities: [
                      { connection: 'N/A' }
                    ]
                  });
                }

                return cb();
              })
              .catch(cb);
          }

          return cb(err);
        });
    }, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve({ total, users });
    });
  });
}
