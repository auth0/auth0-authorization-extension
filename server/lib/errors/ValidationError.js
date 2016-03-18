export default class ValidationError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.name = 'ValidationError';
  }

  toString() {
    return 'ValidationError';
  }
}
