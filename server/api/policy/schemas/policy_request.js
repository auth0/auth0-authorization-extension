import Joi from 'joi';

export default Joi.object().keys({
  connectionName: Joi.string().required(),
  groups: Joi.array()
    .items(Joi.string()),
  disableCaching: Joi.boolean()
});
