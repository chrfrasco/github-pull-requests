import { githubRequest, TIME_BETWEEN_REQUESTS } from './lib/github-request.mjs';
import { connectToDb } from './lib/connect-to-db.mjs';
import { parallelRateLimited } from './lib/parallel-rate-limited.mjs';

(async function main() {
  const { client, db } = await connectToDb();

  const pullRequests = await db
    .collection('pullRequests')
    .find({})
    .toArray();

  let pullRequestCount = 0;
  const tasks = pullRequests.map(pr => async () => {
    console.log(`requesting ${pr.url}`);
    try {
      const response = await githubRequest(pr.url);
      const pullRequests = await response.json();
      await db.collection('pullRequestsDetailed').insertOne(pullRequests);
      pullRequestCount += pullRequests.length;
    } catch (error) {
      console.error(`failed to fetch ${pr.url}: ${error.message}`)
      await db
        .collection('failedRequestURLsDetailed')
        .insertOne({ url: pr.url });
    }
  });

  await parallelRateLimited(TIME_BETWEEN_REQUESTS, tasks);

  client.close();
})();

