import { ArgumentError } from 'auth0-extension-tools';

import { promiseMap } from '../lib/utils';

import apiCall from './apiCall';

export default async function(
  client,
  entity,
  opts = {},
  perPage = 100,
  concurrency = 3
) {
  if (client === null || client === undefined) {
    throw new ArgumentError('Must provide a auth0 client object.');
  }

  if (!entity && !client[entity]) {
    throw new ArgumentError('Must provide a valid entity for auth0 client.');
  }

  const getter = client[entity].getAll;
  const options = Object.assign({}, opts, { per_page: perPage });
  const result = [];
  let total = 0;
  let pageCount = 0;

  const getTotals = async () => {
    const response = await apiCall(client[entity], getter, [
      Object.assign({}, options, { include_totals: true, page: 0 })
    ]);

    total = response.total || 0;
    pageCount = Math.ceil(total / perPage);
    const data = response[entity] || response || [];
    data.forEach((item) => result.push(item));
    return null;
  };

  const getPage = async (page) => {
    const data = await apiCall(client[entity], getter, [ Object.assign({}, options, { page: page }) ]);
    data.forEach((item) => result.push(item));
    return null;
  };

  const getAll = async () => {
    await getTotals();

    if (total === 0 || result.length >= total) {
      return result;
    }

    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
      pages.push(i);
    }

    const getAllResult = await promiseMap(pages, getPage, { concurrency });

    return getAllResult;
  };

  return getAll();
}
