import logger from '../logger';

module.exports = (err, req, res, next) => {
  logger.error(err);

  if (err && err.name === 'NotFoundError') {
    res.status(404);
    return res.json({ error: err.message });
  }

  if (err && err.name === 'ValidationError') {
    res.status(400);
    return res.json({ error: err.message });
  }

  res.status(err.status || 500);
  if (process.env.NODE_ENV === 'production') {
    res.json({
      message: err.message
    });
  } else {
    res.json({
      message: err.message,
      error: {
        message: err.message,
        status: err.status,
        stack: err.stack
      }
    });
  }
};
