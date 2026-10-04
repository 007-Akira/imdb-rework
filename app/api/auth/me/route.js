import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
export async function GET() {
    try {
        return NextResponse.json({ user: await getCurrentUser() });
    }
    catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to read session' }, { status: 503 });
    }
}
