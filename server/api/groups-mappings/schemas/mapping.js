import Joi from 'joi';

export default Joi.object().keys({
  groupName: Joi.string().min(1).max(50).required(),
  connectionName: Joi.string().min(1).max(50).required()
});
