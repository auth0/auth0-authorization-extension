import Joi from 'joi';

export default Joi.object().keys({
  groupsInToken: Joi.boolean(),
  rolesInToken: Joi.boolean(),
  permissionsInToken: Joi.boolean(),
  persistGroups: Joi.boolean(),
  persistRoles: Joi.boolean(),
  persistPermissions: Joi.boolean(),
  groupsPassthrough: Joi.boolean()
});
