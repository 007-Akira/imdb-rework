import { redirect } from 'next/navigation';
import WatchlistView from '@/components/WatchlistView';
import { getCurrentUser } from '@/lib/auth';
export const metadata = { title: 'My Watchlist' };
export default async function Page() { if (!(await getCurrentUser().catch(() => null))) redirect('/login?next=/watchlist'); return <main className="mx-auto min-h-screen max-w-screen px-5 pt-32 md:px-16"><p className="font-bold uppercase tracking-widest text-gold">Your collection</p><h1 className="mb-10 mt-2 text-4xl font-extrabold md:text-6xl">My Watchlist</h1><WatchlistView /></main>; }
