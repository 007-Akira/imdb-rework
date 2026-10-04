import { NextResponse } from 'next/server';
import { RATINGS_COLLECTION } from '@/lib/constants';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { isContentType, isNonEmptyString, isPositiveInteger, isValidRating, parseJsonError } from '@/lib/validation';
// Title and poster are stored with the rating so the profile page can list ratings without calling TMDB.
function titleFields(body) {
    const fields = {};
    if (isNonEmptyString(body.title))
        fields.title = body.title.trim();
    if (typeof body.posterPath === 'string' || body.posterPath === null)
        fields.posterPath = body.posterPath;
    if (typeof body.releaseDate === 'string')
        fields.releaseDate = body.releaseDate;
    return fields;
}
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user)
            return NextResponse.json({ ratings: [] });
        const db = await getDatabase();
        const ratings = await db.collection(RATINGS_COLLECTION).find({ userId: user.id }).sort({ updatedAt: -1 }).toArray();
        return NextResponse.json({ ratings });
    }
    catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to read ratings' }, { status: 503 });
    }
}
export async function PUT(request) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return NextResponse.json({ error: 'Log in to rate titles' }, { status: 401 });
        const body = await request.json();
        if (!isPositiveInteger(body.tmdbId) || !isContentType(body.mediaType) || !isValidRating(body.rating))
            return NextResponse.json({ error: 'tmdbId and mediaType are required; rating must be between 1 and 10' }, { status: 400 });
        const db = await getDatabase();
        const collection = db.collection(RATINGS_COLLECTION);
        await collection.createIndex({ userId: 1, tmdbId: 1, mediaType: 1 }, { unique: true });
        const now = new Date();
        await collection.updateOne({ userId: user.id, tmdbId: body.tmdbId, mediaType: body.mediaType }, { $set: { rating: body.rating, updatedAt: now, ...titleFields(body) }, $setOnInsert: { createdAt: now } }, { upsert: true });
        const rating = await collection.findOne({ userId: user.id, tmdbId: body.tmdbId, mediaType: body.mediaType });
        return NextResponse.json({ rating });
    }
    catch (error) {
        const invalidJson = error instanceof SyntaxError;
        return NextResponse.json({ error: parseJsonError(error) }, { status: invalidJson ? 400 : 503 });
    }
}
export const POST = PUT;
