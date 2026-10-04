import { NextResponse } from 'next/server';
import { MongoServerError } from 'mongodb';
import { createSession, getUsersCollection, hashPassword } from '@/lib/auth';
import { isNonEmptyString, isValidEmail, isValidPassword, MIN_PASSWORD_LENGTH, parseJsonError } from '@/lib/validation';
export async function POST(request) {
    try {
        const body = await request.json();
        if (!isNonEmptyString(body.name) || !isValidEmail(body.email))
            return NextResponse.json({ error: 'A name and a valid email address are required' }, { status: 400 });
        if (!isValidPassword(body.password))
            return NextResponse.json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` }, { status: 400 });
        const users = await getUsersCollection();
        const document = { name: body.name.trim(), email: body.email.trim().toLowerCase(), passwordHash: await hashPassword(body.password), createdAt: new Date() };
        const result = await users.insertOne(document);
        const id = result.insertedId.toString();
        await createSession(id);
        return NextResponse.json({ user: { id, name: document.name, email: document.email } }, { status: 201 });
    }
    catch (error) {
        if (error instanceof MongoServerError && error.code === 11000)
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
        const invalidJson = error instanceof SyntaxError;
        return NextResponse.json({ error: parseJsonError(error) }, { status: invalidJson ? 400 : 503 });
    }
}
