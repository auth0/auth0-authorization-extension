const async = require('async');
const request = require('superagent');

const {
  AUTHZ_URL,
  AUTHZ_TOKEN,
  GROUPS_NUMBER,
  USERS_PER_GROUP
} = require('./script-settings.example.json');

const fakeUsers = [];
const uid = 'fake|' + new Date().getTime();

for (let i = 0; i < USERS_PER_GROUP; i++) {
  fakeUsers.push(uid + i);
}

const addToGroup = (gid, cb) => {
  console.log('Adding ' + fakeUsers.length + ' users to ' + gid + ' group'); // eslint-disable-line no-console
  request
    .patch(AUTHZ_URL + '/groups/' + gid + '/members')
    .set('Authorization', 'Bearer ' + AUTHZ_TOKEN)
    .set('Content-Type', 'application/json')
    .send(fakeUsers)
    .end((err, res) => {
      if (err || (res && res.body && res.body.error)) {
        return cb(err || res.body.error);
      }

      return cb();
    });
};

const createGroup = (name, cb) => {
  const data = {
    name: name || new Date().getTime(),
    description: 'test group'
  };
  request
    .post(AUTHZ_URL + '/groups')
    .set('Authorization', 'Bearer ' + AUTHZ_TOKEN)
    .set('Content-Type', 'application/json')
    .send(data)
    .end((err, res) => {
      if (err || (res && res.body && res.body.error)) {
        return cb(err || res.body.error);
      }

      return cb(null, res.body);
    });
};

async.timesLimit(
  GROUPS_NUMBER,
  1,
  (i, next) => {
    createGroup('Group' + i, (err, group) => {
      if (err) {
        return next(err);
      }

      return addToGroup(group._id, next);
    });
  },
  (err) => {
    console.log(err); // eslint-disable-line no-console
  }
);
