import async from 'async';
import Promise from 'bluebird';

export function getUsersById(client, users, options) {
  return new Promise((resolve, reject) => {
    const records = [];

    async.eachLimit(users, 10, (userId, cb) => {
      client.users.get({ id: userId })
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

export function getUsersByIds(client, ids, page, limit) {
  const searchArray = [];
  const total = ids.length;
  const options = {
    q: '',
    per_page: limit || 100,
    page: page || 0,
    fields: 'user_id,name,email,identities,picture,last_login,logins_count,multifactor,blocked',
    search_engine: 'v2'
  };


  ids = ids.splice(page * limit, limit); // eslint-disable-line no-param-reassign

  ids.forEach(id => {
    const clear = id.split('|')[1];

    if (clear) {
      searchArray.push(`user_id:*${clear}`);
    }
  });

  options.q = searchArray.join(' OR ');

  return client.users.getAll(options)
    .then(users => ({ total, users }));
}
