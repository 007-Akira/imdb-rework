import { NextResponse } from 'next/server';
import { createSession, getUsersCollection, verifyPassword } from '@/lib/auth';
import { isNonEmptyString, isValidEmail, parseJsonError } from '@/lib/validation';
export async function POST(request) {
    try {
        const body = await request.json();
        if (!isValidEmail(body.email) || !isNonEmptyString(body.password))
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        const users = await getUsersCollection();
        const user = await users.findOne({ email: body.email.trim().toLowerCase() });
        // Same message for unknown email and wrong password, so the form does not reveal which accounts exist.
        if (!user || !(await verifyPassword(body.password, user.passwordHash)))
            return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 });
        const id = user._id.toString();
        await createSession(id);
        return NextResponse.json({ user: { id, name: user.name, email: user.email } });
    }
    catch (error) {
        const invalidJson = error instanceof SyntaxError;
        return NextResponse.json({ error: parseJsonError(error) }, { status: invalidJson ? 400 : 503 });
    }
}
