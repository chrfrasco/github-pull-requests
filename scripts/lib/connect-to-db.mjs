// @ts-check
import mongodb from 'mongodb';

const mongoURI = 'mongodb://localhost:27017';
const dbName = 'timeToMerge';

export async function connectToDb() {
  const client = await mongodb.MongoClient.connect(
    mongoURI,
    {
      useNewUrlParser: true,
    },
  );
  console.log(`connected to mongo instance at ${mongoURI}`);

  const db = await client.db(dbName);
  console.log(`connected to database "${dbName}"`);
  return { db, client };
}
