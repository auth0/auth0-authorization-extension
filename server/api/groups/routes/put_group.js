import Joi from 'joi';
import schema from '../schemas/group';

export default () => ({
  method: 'PUT',
  path: '/api/groups/{id}',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Update a group.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      params: Joi.object({
        id: Joi.string().guid().required()
      }),
      payload: schema
    }
  },
  handler: async (req, h) => {
    const group = req.payload;
    const updated = await req.storage.updateGroup(req.params.id, group);
    // unit tests expect a 200 status code so for consistency this has not been updated to 201
    return h.response(updated).code(200);
  }
});
