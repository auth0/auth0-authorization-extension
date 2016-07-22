import Joi from 'joi';
import mapping from './mapping';

export default Joi.array()
  .items(mapping)
  .required()
  .min(1);
