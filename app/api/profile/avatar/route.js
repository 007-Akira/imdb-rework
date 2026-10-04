import { NextResponse } from 'next/server';
import { Binary, ObjectId } from 'mongodb';
import { getCurrentUser, getUsersCollection, toPublicUser } from '@/lib/auth';
import { AVATAR_TYPES, MAX_AVATAR_BYTES } from '@/lib/validation';
// Check the file's leading bytes too, because the declared type comes from the client.
function matchesImageSignature(bytes, type) {
    if (type === 'image/jpeg')
        return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (type === 'image/png')
        return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    return bytes.subarray(0, 4).toString('latin1') === 'RIFF' && bytes.subarray(8, 12).toString('latin1') === 'WEBP';
}
// Accepts multipart form data with an "avatar" file field and stores the bytes on the user document.
export async function PUT(request) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return NextResponse.json({ error: 'Log in to change your profile picture' }, { status: 401 });
        const form = await request.formData().catch(() => null);
        const file = form?.get('avatar');
        if (!file || typeof file === 'string')
            return NextResponse.json({ error: 'Choose an image to upload' }, { status: 400 });
        if (!AVATAR_TYPES.includes(file.type))
            return NextResponse.json({ error: 'Profile pictures must be JPEG, PNG, or WebP' }, { status: 400 });
        if (file.size > MAX_AVATAR_BYTES)
            return NextResponse.json({ error: 'Profile picture is too large' }, { status: 413 });
        const bytes = Buffer.from(await file.arrayBuffer());
        if (!matchesImageSignature(bytes, file.type))
            return NextResponse.json({ error: 'That file is not a valid image' }, { status: 400 });
        const data = new Binary(bytes);
        const users = await getUsersCollection();
        const updated = await users.findOneAndUpdate({ _id: new ObjectId(user.id) }, { $set: { avatar: { data, contentType: file.type, updatedAt: new Date() } } }, { returnDocument: 'after', projection: { passwordHash: 0, 'avatar.data': 0 } });
        return NextResponse.json({ user: toPublicUser(updated) });
    }
    catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save profile picture' }, { status: 503 });
    }
}
export async function DELETE() {
    try {
        const user = await getCurrentUser();
        if (!user)
            return NextResponse.json({ error: 'Log in to change your profile picture' }, { status: 401 });
        const users = await getUsersCollection();
        const updated = await users.findOneAndUpdate({ _id: new ObjectId(user.id) }, { $unset: { avatar: '' } }, { returnDocument: 'after', projection: { passwordHash: 0 } });
        return NextResponse.json({ user: toPublicUser(updated) });
    }
    catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to remove profile picture' }, { status: 503 });
    }
}
