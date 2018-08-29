import Joi from 'joi';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/users',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:users' ]
    },
    description: 'Get all users.',
    validate: {
      query: {
        q: Joi.string().max(1000).allow('').default(''),
        field: Joi.string().max(1000).allow('').default(''),
        per_page: Joi.number().integer().min(1).max(200).default(100), // eslint-disable-line newline-per-chained-call
        page: Joi.number().integer().min(0).default(0)
      }
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) => {
    const page = (req.query.page - 1 < 0) ? 0 : req.query.page - 1;
    const options = {
      sort: 'last_login:-1',
      q: req.query.field ? `${req.query.field}:${req.query.q}` : req.query.q,
      per_page: req.query.per_page || 100,
      page: page || 0,
      include_totals: true,
      fields: 'user_id,name,email,identities,picture,last_login,logins_count,multifactor,blocked',
      search_engine: 'v3'
    };

    req.pre.auth0.users.getAll(options)
      .then(users => reply(users))
      .catch(err => reply.error(err));
  }
});
