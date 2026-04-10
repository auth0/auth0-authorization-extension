const MAX_RETRY_TIMEOUT = 10;

const sleep = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export default async (client, method, args, retry = 2) => {
  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const { data: result } = await method.call(client, ...args);
      return result;
    } catch (err) {
      const originalError = err.originalError || {};
      const ratelimitReset =
        originalError.response?.header?.["x-ratelimit-reset"] || 0;
      const currentTime = Math.round(Date.now() / 1000);
      const timeout = Math.max(parseInt(ratelimitReset, 10) - currentTime, 1);
      const shouldRetry =
        originalError.status === 429 &&
        attempt < retry &&
        ratelimitReset &&
        timeout <= MAX_RETRY_TIMEOUT;

      if (!shouldRetry) throw err;

      await sleep(timeout);
    }
  }
};
