'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { apiRequest } from '@/lib/client-api';
import { isValidEmail, MIN_PASSWORD_LENGTH, safeRedirectPath } from '@/lib/validation';
// mode is 'login' or 'register'; next is where to go after a successful sign-in.
export default function AuthForm({ mode, next }) {
    const router = useRouter();
    const isRegister = mode === 'register';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState();
    const destination = safeRedirectPath(next);
    const otherHref = `${isRegister ? '/login' : '/register'}${destination !== '/' ? `?next=${encodeURIComponent(destination)}` : ''}`;
    async function submit(event) {
        event.preventDefault();
        if (isRegister && !name.trim())
            return setError('Enter your name');
        if (!isValidEmail(email))
            return setError('Enter a valid email address');
        if (isRegister && password.length < MIN_PASSWORD_LENGTH)
            return setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
        if (!password)
            return setError('Enter your password');
        setSubmitting(true);
        setError(undefined);
        try {
            const body = isRegister ? { name, email, password } : { email, password };
            await apiRequest(`/api/auth/${mode}`, { method: 'POST', body: JSON.stringify(body) });
            router.replace(destination);
            router.refresh();
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong');
            setSubmitting(false);
        }
    }
    const inputClass = 'mt-2 w-full rounded-lg border border-white/10 bg-surface-high p-3 transition focus:border-gold/60';
    return <form onSubmit={submit} noValidate className="anim-scale-in w-full max-w-md rounded-2xl border border-white/5 bg-surface p-8 shadow-2xl"><h1 className="text-3xl font-extrabold">{isRegister ? 'Create account' : 'Sign in'}</h1><p className="mt-2 text-sm text-muted">{isRegister ? 'Keep your watchlist and ratings in one place.' : 'Welcome back. Pick up where you left off.'}</p>{isRegister && <label className="mt-8 block text-sm font-semibold">Name<input autoComplete="name" value={name} onChange={event => setName(event.target.value)} className={inputClass}/></label>}<label className={`${isRegister ? 'mt-5' : 'mt-8'} block text-sm font-semibold`}>Email<input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className={inputClass}/></label><label className="mt-5 block text-sm font-semibold">Password<input type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={event => setPassword(event.target.value)} className={inputClass}/></label>{isRegister && <p className="mt-2 text-xs text-muted">At least {MIN_PASSWORD_LENGTH} characters.</p>}{error && <p role="alert" className="mt-5 text-sm text-red-300">{error}</p>}<button disabled={submitting} className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 font-bold text-black disabled:opacity-60">{submitting && <LoaderCircle className="h-4 w-4 animate-spin"/>}{isRegister ? 'Create account' : 'Sign in'}</button><p className="mt-6 text-center text-sm text-muted">{isRegister ? 'Already have an account?' : 'New to IMDb?'} <Link href={otherHref} className="font-semibold text-gold hover:underline">{isRegister ? 'Sign in' : 'Create an account'}</Link></p></form>;
}
