import Link from 'next/link';
import Grid from '@/components/Grid';
import { search } from '@/lib/tmdb';
export const metadata = { title: 'Search' };
export default async function Page({ searchParams }) { const { q = '', type = 'all' } = await searchParams; let items = []; try {
    items = (await search(q)).results.filter(x => ['movie', 'tv', 'person'].includes(x.media_type || ''));
}
catch { } const filtered = type === 'all' ? items : items.filter((x) => x.media_type === type); return <main className="mx-auto min-h-screen max-w-screen px-5 pt-32 md:px-16"><p className="text-muted">Search results for</p><h1 className="mt-2 text-4xl font-extrabold">“{q}”</h1><div className="my-8 flex flex-wrap gap-2">{[['all', 'All'], ['movie', 'Movies'], ['tv', 'TV'], ['person', 'People']].map(([v, l]) => <Link key={v} href={`/search?q=${encodeURIComponent(q)}&type=${v}`} className={`rounded-full px-5 py-2 ${type === v ? 'bg-gold text-black' : 'bg-surface-high'}`}>{l}</Link>)}</div>{filtered.length ? <Grid items={filtered}/> : <div className="rounded-xl bg-surface p-12 text-center text-muted">No results found. Try a different title, show or person.</div>}</main>; }
