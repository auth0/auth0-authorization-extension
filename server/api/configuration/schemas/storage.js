import Joi from 'joi';
import configSchema from './configuration';
import groupSchema from '../../groups/schemas/group';
import roleSchema from '../../roles/schemas/role';
import permissionSchema from '../../permissions/schemas/permission';

const extend = (schema) => schema.keys({ _id: Joi.string().required() });

export default Joi.object().keys({
  configuration: Joi.array().items(extend(configSchema)),
  groups: Joi.array().items(extend(groupSchema)),
  roles: Joi.array().items(extend(roleSchema)),
  permissions: Joi.array().items(extend(permissionSchema)),
  applications: Joi.array().items(Joi.object()),
  rules: Joi.array().items(Joi.object())
});
