  import _ from 'lodash';                                                                                                                                                                                    
  import apiCall from './apiCall';
                                                                                                                                                                                                             
  const CONCURRENCY = 10;

  async function fetchUser(client, userId) {
    try {
      return await apiCall(client.users, client.users.get, [{ id: userId }]);
    } catch (err) {
      return {
        user_id: userId,
        name: `<Error: ${err?.name || err?.statusCode}>`,
        email: userId,
        identities: [{ connection: 'N/A' }]
      };
    }
  }

  export async function getUsersById(client, ids, page, limit) {
    const total = ids.length;
    const start = Math.max(page - 1, 0) * limit;
    const pageIds = ids.slice(start, start + limit);

    const users = [];
    for (let i = 0; i < pageIds.length; i += CONCURRENCY) {
      const batch = pageIds.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map((userId) => fetchUser(client, userId)));
      users.push(...results);
    }

    return { total, users: _.sortBy(users, ['user_id']) };
  }