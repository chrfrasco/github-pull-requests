import { githubRequest, TIME_BETWEEN_REQUESTS } from './lib/github-request.mjs';
import { connectToDb } from './lib/connect-to-db.mjs';
import { parallelRateLimited } from './lib/parallel-rate-limited.mjs';

(async function main() {
  const { client, db } = await connectToDb();

  const pullRequests = await db
    .collection('pullRequests')
    .find({})
    .toArray();

  const tasks = pullRequests.map(pr => async () => {
    const result = await githubRequest(pr.url);
  });

  await parallelRateLimited(TIME_BETWEEN_REQUESTS, tasks);

  client.close();
})();

