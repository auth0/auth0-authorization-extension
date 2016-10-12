import Joi from 'joi';

export default Joi.object().keys({
  configuration: Joi.array().items(Joi.object()),
  groups: Joi.array().items(Joi.object()),
  roles: Joi.array().items(Joi.object()),
  permissions: Joi.array().items(Joi.object()),
  applications: Joi.array().items(Joi.object()),
  rules: Joi.array().items(Joi.object())
});
