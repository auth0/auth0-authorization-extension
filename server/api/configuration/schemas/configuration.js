import Joi from 'joi';

export default Joi.object().keys({
  groupsInIdToken: Joi.boolean(),
  rolesInIdToken: Joi.boolean(),
  permissionsInIdToken: Joi.boolean(),
  idTokenNamespace: Joi.string(),
  groupsInAccessToken: Joi.boolean(),
  rolesInAccessToken: Joi.boolean(),
  permissionsInAccessToken: Joi.boolean(),
  accessTokenNamespace: Joi.string(),
  persistGroups: Joi.boolean(),
  persistRoles: Joi.boolean(),
  persistPermissions: Joi.boolean(),
  groupsPassthrough: Joi.boolean(),
  rolesPassthrough: Joi.boolean(),
  permissionsPassthrough: Joi.boolean(),
  persistOnClientLevel: Joi.boolean(),
  disableCaching: Joi.boolean()
});
