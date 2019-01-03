// @ts-check
import { parallelRateLimited } from './lib/parallel-rate-limited.mjs';
import { githubRequest, TIME_BETWEEN_REQUESTS } from './lib/github-request.mjs';
import { connectToDb } from './lib/connect-to-db.mjs';

(async function main() {
  const { db, client } = await connectToDb();

  const pageCount = await getPageCount();
  console.log(`about to request ${pageCount} pages of pull requests`);

  const urls = range(pageCount).map(page => `/repos/Canva/canva/pulls?state=closed&page=${page}`);

  let pullRequestCount = 0;
  const tasks = urls.map(url => {
    return async () => {
      console.log(`requesting ${url}`);
      try {
        const response = await githubRequest(url);
        const pullRequests = await response.json();
        await db.collection('pullRequests').insertMany(pullRequests);
        pullRequestCount += pullRequests.length;
      } catch (error) {
        await db.collection('failedRequestURLs').insertOne({ url });
      }
    };
  });

  await parallelRateLimited(TIME_BETWEEN_REQUESTS, tasks);

  console.log(`wrote ${pullRequestCount} pull requests to the db`);
  client.close();
})();

async function getPageCount() {
  const request = await githubRequest('/repos/Canva/canva/pulls?state=closed');
  let urls = getURLs(request.headers.get('link'));
  const lastPage = parseInt(urls.last.replace(/.*&page=(\d+)$/, '$1'), 10);
  return lastPage;
}

function range(length) {
  return Array.from({ length }, (_, i) => i);
}

const linkPattern = /<(.*)>; rel="(.*)"/;
/**
 * @param {string} link
 */
function getURLs(link) {
  return link.split(',').reduce(
    (urls, link) => {
      const [_, url, rel] = linkPattern.exec(link);
      urls[rel] = url;
      return urls;
    },
    { next: undefined, prev: undefined, last: undefined },
  );
}
