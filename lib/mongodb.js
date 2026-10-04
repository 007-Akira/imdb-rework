import { MongoClient } from 'mongodb';
import { DATABASE_NAME } from './constants';
const uri = process.env.MONGODB_URI;
function createClientPromise() {
    if (!uri)
        throw new Error('MONGODB_URI is not configured');
    return new MongoClient(uri).connect();
}
export async function getDatabase() {
    if (!global.mongodbClientPromise)
        global.mongodbClientPromise = createClientPromise();
    const client = await global.mongodbClientPromise;
    return client.db(DATABASE_NAME);
}
