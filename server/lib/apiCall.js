import Promise from 'bluebird';

const idle = (timeout) =>
  new Promise(resolve => setTimeout(() => resolve(), timeout * 1000));

export default (context, promise, args, retry = 3) => {
  let retriesLeft = retry;

  const tryRequest = () => promise.apply(context, args)
    .then(data => Promise.resolve(data))
    .catch((err) => {
      const originalError = err.originalError || {};
      const ratelimitReset = (originalError.response && originalError.response.header && originalError.response.header['x-ratelimit-reset']) || 0;
      const currentTime = Math.round(new Date().getTime() / 1000) - 1;
      const maxTimeout = 5; // wait for 5 seconds max
      let timeout = parseInt(ratelimitReset, 10) - currentTime;

      if (originalError.status === 429 && retriesLeft > 0 && ratelimitReset && timeout <= maxTimeout) {
        retriesLeft--;
        if (timeout <= 0) {
          timeout = 1;
        }

        return idle(timeout).then(tryRequest);
      }

      return Promise.reject(err.originalError || err);
    });

  return tryRequest();
};
