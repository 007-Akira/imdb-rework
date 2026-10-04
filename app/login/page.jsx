import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';
import { safeRedirectPath } from '@/lib/validation';
export const metadata = { title: 'Sign in' };
export default async function Page({ searchParams }) { const { next } = await searchParams; if (await getCurrentUser().catch(() => null)) redirect(safeRedirectPath(next)); return <main className="grid min-h-screen place-items-center px-5 pb-16 pt-32"><AuthForm mode="login" next={next}/></main>; }
