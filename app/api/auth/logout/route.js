import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';
export async function POST() {
    try {
        await destroySession();
        return NextResponse.json({ loggedOut: true });
    }
    catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to log out' }, { status: 503 });
    }
}
