import Joi from 'joi';

export default Joi.object().keys({
  connectionName: Joi.string().required(),
  clientId: Joi.string().required(),
  groups: Joi.array()
    .items(Joi.string().string())
});
