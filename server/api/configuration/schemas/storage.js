import Joi from 'joi';
import configSchema from './configuration';

const extend = (schema) => schema.keys({ _id: Joi.string().required() });

export default Joi.object().keys({
  configuration: Joi.array().items(extend(configSchema)),
  groups: Joi.array().items(Joi.object()),
  roles: Joi.array().items(Joi.object()),
  permissions: Joi.array().items(Joi.object()),
  applications: Joi.array().items(Joi.object()),
  rules: Joi.array().items(Joi.object())
});
