import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, SESSIONS_COLLECTION, USERS_COLLECTION } from './constants';
import { getDatabase } from './mongodb';
const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;
// Stored as "salt:hash" (both hex) so each password gets its own random salt.
export async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const hash = await scryptAsync(password, salt, KEY_LENGTH);
    return `${salt}:${hash.toString('hex')}`;
}
export async function verifyPassword(password, stored) {
    const [salt, hashHex] = stored.split(':');
    if (!salt || !hashHex)
        return false;
    const expected = Buffer.from(hashHex, 'hex');
    const actual = await scryptAsync(password, salt, expected.length);
    return timingSafeEqual(actual, expected);
}
// Only a SHA-256 of the token is stored, so a leaked sessions collection cannot be replayed as cookies.
function hashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}
export async function getUsersCollection() {
    const db = await getDatabase();
    const users = db.collection(USERS_COLLECTION);
    await users.createIndex({ email: 1 }, { unique: true });
    return users;
}
async function getSessionsCollection() {
    const db = await getDatabase();
    const sessions = db.collection(SESSIONS_COLLECTION);
    await sessions.createIndex({ tokenHash: 1 }, { unique: true });
    await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    return sessions;
}
export async function createSession(userId) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
    const sessions = await getSessionsCollection();
    await sessions.insertOne({ tokenHash: hashToken(token), userId, createdAt: new Date(), expiresAt });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', expires: expiresAt });
}
export async function destroySession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) {
        const sessions = await getSessionsCollection();
        await sessions.deleteOne({ tokenHash: hashToken(token) });
    }
    cookieStore.delete(SESSION_COOKIE);
}
// Returns { id, name, email } for the signed-in user, or null.
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token)
        return null;
    const sessions = await getSessionsCollection();
    const session = await sessions.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } });
    if (!session)
        return null;
    const users = await getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(session.userId) }, { projection: { passwordHash: 0, 'avatar.data': 0 } });
    if (!user)
        return null;
    return toPublicUser(user);
}
// The avatar image itself is served by /api/users/[id]/avatar; ?v= busts the browser cache after a new upload.
export function toPublicUser(user) {
    const id = user._id.toString();
    return { id, name: user.name, email: user.email, bio: user.bio || '', createdAt: user.createdAt, avatarUrl: user.avatar ? `/api/users/${id}/avatar?v=${new Date(user.avatar.updatedAt).getTime()}` : null };
}
