'use client';
import { useEffect, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import Grid, { GridSkeleton } from './Grid';
import { filtersToQuery, RATING_OPTIONS, SORT_OPTIONS } from '@/lib/discover';
const selectClass = 'w-full rounded-lg bg-surface-high p-3 transition hover:bg-surface-highest';
export default function Explore({ initial, initialTotalPages, initialFilters, genreList }) {
    const [items, setItems] = useState(initial);
    const [filters, setFilters] = useState(initialFilters);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    // 'filter' while a new filter's first page loads, 'more' while appending the next page.
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState();
    // Filters whose results are currently shown; starts as the server-rendered ones.
    const loadedFilters = useRef(initialFilters);
    const discoverUrl = (n) => `/api/discover?${filtersToQuery(filters)}&page=${n}`;
    useEffect(() => {
        if (loadedFilters.current === filters)
            return;
        // Keep the URL in sync without a server round trip, so the view can be bookmarked or shared.
        const query = filtersToQuery(filters);
        window.history.replaceState(null, '', query ? `/movies?${query}` : '/movies');
        const c = new AbortController();
        setLoading('filter');
        setError(undefined);
        fetch(discoverUrl(1), { signal: c.signal }).then(r => r.json()).then(d => { loadedFilters.current = filters; setItems(d.results || []); setTotalPages(d.total_pages || 1); setPage(1); }).catch(e => { if (e.name !== 'AbortError')
            setError('Could not load movies. Try again.'); }).finally(() => { if (!c.signal.aborted)
            setLoading(null); });
        return () => c.abort();
    }, [filters]);
    async function more() {
        setLoading('more');
        setError(undefined);
        try {
            const n = page + 1, d = await fetch(discoverUrl(n)).then(r => r.json());
            setItems(x => [...x, ...(d.results || []).filter(item => !x.some(existing => existing.id === item.id))]);
            setPage(n);
            setTotalPages(d.total_pages || n);
        }
        catch {
            setError('Could not load more movies. Try again.');
        }
        finally {
            setLoading(null);
        }
    }
    const update = (key) => (event) => setFilters(current => ({ ...current, [key]: event.target.value }));
    return <>
    <div className="mb-10 grid gap-3 rounded-xl bg-surface p-4 sm:grid-cols-3">
      <label><span className="sr-only">Genre</span><select value={filters.genre} onChange={update('genre')} className={selectClass}><option value="">All genres</option>{genreList.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></label>
      <label><span className="sr-only">Minimum rating</span><select value={filters.rating} onChange={update('rating')} className={selectClass}>{RATING_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label><span className="sr-only">Sort by</span><select value={filters.sort} onChange={update('sort')} className={selectClass}>{SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </div>
    <p role="status" className="sr-only">{loading ? 'Loading movies…' : `${items.length} movies shown`}</p>
    <div aria-busy={!!loading}>
      {loading === 'filter' ? <GridSkeleton count={10}/> : items.length ? <Grid items={items}/> : <p className="rounded-xl bg-surface p-12 text-center text-muted">No movies match these filters. Try a different genre or rating.</p>}
      {loading === 'more' && <div className="mt-4"><GridSkeleton count={5}/></div>}
    </div>
    {error && <p role="alert" className="mt-6 text-center text-sm text-red-300">{error}</p>}
    {loading !== 'filter' && items.length > 0 && page < totalPages && <button disabled={!!loading} onClick={more} className="mx-auto mt-10 flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-bold text-black disabled:opacity-60">{loading === 'more' && <LoaderCircle className="h-4 w-4 animate-spin"/>}{loading === 'more' ? 'Loading…' : 'Load More'}</button>}
  </>;
}
