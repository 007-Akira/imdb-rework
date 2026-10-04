import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { WATCHLIST_COLLECTION } from '@/lib/constants';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
export async function DELETE(_, { params }) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return NextResponse.json({ error: 'Log in to manage your watchlist' }, { status: 401 });
        const { id } = await params;
        if (!ObjectId.isValid(id))
            return NextResponse.json({ error: 'Invalid watchlist document ID' }, { status: 400 });
        const db = await getDatabase();
        const result = await db.collection(WATCHLIST_COLLECTION).deleteOne({ _id: new ObjectId(id), userId: user.id });
        if (!result.deletedCount)
            return NextResponse.json({ error: 'Watchlist item not found' }, { status: 404 });
        return NextResponse.json({ deleted: true });
    }
    catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to remove item' }, { status: 503 });
    }
}
