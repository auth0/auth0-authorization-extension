import Joi from 'joi';

const expandedBoolean = Joi.boolean().truthy('yes').falsy('no');

export default Joi.object().keys({
  groupsInToken: expandedBoolean,
  rolesInToken: expandedBoolean,
  permissionsInToken: expandedBoolean,
  persistGroups: expandedBoolean,
  persistRoles: expandedBoolean,
  persistPermissions: expandedBoolean,
  groupsPassthrough: expandedBoolean,
  rolesPassthrough: expandedBoolean,
  permissionsPassthrough: expandedBoolean
});
