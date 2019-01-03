// @ts-check
import fs from 'fs';
import { connectToDb } from './lib/connect-to-db.mjs';

(async function main() {
  const { db, client } = await connectToDb();

  const prs = await db
    .collection('pullRequests')
    .find({})
    .toArray();
  console.log(`read ${prs.length} pull request objects into memory`);

  fs.writeFileSync('./data/pull-requests.json', JSON.stringify(prs));
  console.log(`wrote prs to ./pull-requests.json`);

  client.close();
})();
