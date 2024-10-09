export const promiseEach = async (arr, fn) => {
  for (const item of arr) {
    await fn(item);
  }
};

export const promiseMap = async (arr, fn) => {
  const results = [];
  for (const item of arr) {
    await fn(item);
    results.push(item);
  }
  return results;
};
