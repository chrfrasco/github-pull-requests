// @ts-check

/**
 * @param {number} period
 * @param {Array<() => Promise<void>>} tasks 
 */
export async function parallelRateLimited(period, tasks) {
  const promises = [];
  for (const task of tasks) {
    promises.push(Promise.resolve(task()));
    await sleep(period);
  }
  return Promise.all(promises);
}

/**
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
