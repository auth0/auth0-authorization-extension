import Joi from 'joi';

export default Joi.object().keys({
  name: Joi.string().min(1).max(50).required(),
  description: Joi.string().min(1).max(500).required(),
  applicationType: Joi.string().valid('client', 'resource_server').required(),
  applicationId: Joi.string().min(1).max(500).required(),
  permissions: Joi.array()
    .items(Joi.string().guid())
    .default([ ])
});
