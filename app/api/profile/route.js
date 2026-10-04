import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser, getUsersCollection, toPublicUser } from '@/lib/auth';
import { isNonEmptyString, MAX_BIO_LENGTH, MAX_NAME_LENGTH, parseJsonError } from '@/lib/validation';
export async function PATCH(request) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return NextResponse.json({ error: 'Log in to edit your profile' }, { status: 401 });
        const body = await request.json();
        if (!isNonEmptyString(body.name) || body.name.trim().length > MAX_NAME_LENGTH)
            return NextResponse.json({ error: `Name is required and must be at most ${MAX_NAME_LENGTH} characters` }, { status: 400 });
        if (typeof body.bio !== 'string' || body.bio.trim().length > MAX_BIO_LENGTH)
            return NextResponse.json({ error: `Bio must be at most ${MAX_BIO_LENGTH} characters` }, { status: 400 });
        const users = await getUsersCollection();
        const updated = await users.findOneAndUpdate({ _id: new ObjectId(user.id) }, { $set: { name: body.name.trim(), bio: body.bio.trim() } }, { returnDocument: 'after', projection: { passwordHash: 0, 'avatar.data': 0 } });
        return NextResponse.json({ user: toPublicUser(updated) });
    }
    catch (error) {
        const invalidJson = error instanceof SyntaxError;
        return NextResponse.json({ error: parseJsonError(error) }, { status: invalidJson ? 400 : 503 });
    }
}
