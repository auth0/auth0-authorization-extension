import Joi from 'joi';

export default Joi.array()
  .items(Joi.string())
  .required()
  .min(1);
