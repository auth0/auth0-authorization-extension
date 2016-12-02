import Joi from 'joi';

export default Joi.array()
  .items(Joi.string().guid())
  .required()
  .min(1);
