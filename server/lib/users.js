import _ from 'lodash';
import Promise from 'bluebird';
import apiCall from './apiCall';

export function getUsersById(client, ids, page, limit) {
  return new Promise((resolve, reject) => {
    const total = ids.length;

    page = (page - 1 < 0) ? 0 : page - 1; // eslint-disable-line no-param-reassign
    if (!ids || ids.length === 0) {
      return resolve({ total, users: [] });
    }
    let idStr = ids.join('" OR "');
    idStr = '"' + idStr + '"';
    const queryString = `user_id: (${idStr})`;

    apiCall(client, client.users.getAll, [ { q: queryString, page: page, per_page: limit, include_totals: true } ])
    .then(function(res) {
      const sorted = _.sortByOrder(res.users, 'user_id');
      return resolve({ total: res.total, users: sorted });
    })
    .catch(function(err) {
      reject(err);
    });
  });
}
