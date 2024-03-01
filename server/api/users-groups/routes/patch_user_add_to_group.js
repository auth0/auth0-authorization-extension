import Promise from 'bluebird';
import Joi from 'joi';
import _ from 'lodash';

export default () => ({
  method: 'PATCH',
  path: '/api/users/{id}/groups',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Add a single user to groups.',
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      }),
      payload: Joi.array().items(Joi.string()).required().min(1)
    }
  },
  handler: (req, reply) => {
    const groupIds = req.payload;
    const pattern = /^(\{{0,1}([0-9a-fA-F]){8}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){12}\}{0,1})$/;
    const searchBy = pattern.test(groupIds[0]) ? '_id' : 'name';

    req.storage
      .getGroups()
      .then((groups) =>
        _.filter(groups, (group) => _.includes(groupIds, group[searchBy]))
      )
      .then((filtered) =>
        Promise.each(filtered, (group) => {
          if (!group.members) {
            group.members = []; // eslint-disable-line no-param-reassign
          }
          if (group.members.indexOf(req.params.id) === -1) {
            group.members.push(req.params.id);
          }

          return req.storage.updateGroup(group._id, group);
        })
      )
      .then(() => reply().code(204))
      .catch((err) => reply.error(err));
  }
});
