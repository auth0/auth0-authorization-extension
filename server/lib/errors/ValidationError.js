function ValidationError(message) {
  const err = Error.call(this, message);
  err.name = 'ValidationError';
  err.message = message;
  return err;
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;
export default ValidationError;
