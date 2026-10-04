import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/auth';
export async function GET(_, { params }) {
    try {
        const { id } = await params;
        if (!ObjectId.isValid(id))
            return new Response('Not found', { status: 404 });
        const users = await getUsersCollection();
        const user = await users.findOne({ _id: new ObjectId(id) }, { projection: { avatar: 1 } });
        if (!user?.avatar)
            return new Response('Not found', { status: 404 });
        // URLs carry ?v=<updatedAt>, so each version can be cached for a long time.
        return new Response(user.avatar.data.buffer, { headers: { 'Content-Type': user.avatar.contentType, 'Cache-Control': 'private, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
    }
    catch {
        return new Response('Unavailable', { status: 503 });
    }
}
