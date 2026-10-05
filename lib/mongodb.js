import { MongoClient } from 'mongodb';
import { DATABASE_NAME } from './constants';
const uri = process.env.MONGODB_URI;
function createClientPromise() {
    if (!uri)
        throw new Error('MONGODB_URI is not configured');
    return new MongoClient(uri).connect();
}
export async function getDatabase() {
    if (!global.mongodbClientPromise) {
        const attempt = createClientPromise();
        global.mongodbClientPromise = attempt;
        // Don't cache a failed connection (e.g. a brief network/DNS outage), or every later request
        // would fail instantly until the server restarts. Clearing it lets the next request retry.
        attempt.catch(() => { if (global.mongodbClientPromise === attempt)
            global.mongodbClientPromise = undefined; });
    }
    const client = await global.mongodbClientPromise;
    return client.db(DATABASE_NAME);
}
