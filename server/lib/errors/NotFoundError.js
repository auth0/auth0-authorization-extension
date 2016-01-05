function NotFoundError(message) {
  const err = Error.call(this, message);
  err.name = 'NotFoundError';
  err.message = message;
  return err;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;
export default NotFoundError;
