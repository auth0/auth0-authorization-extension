import Joi from 'joi';

export default Joi.object().keys({
  groups: Joi.array()
    .items(Joi.string())
});
