export default class NotFoundError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.name = 'NotFoundError';
  }

  toString() {
    return 'NotFoundError';
  }
}
