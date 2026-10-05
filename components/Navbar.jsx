'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Bookmark, LoaderCircle, LogOut, Menu, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { image, mediaType, title, year } from '@/lib/tmdb';
import { apiRequest } from '@/lib/client-api';
import { Avatar } from './ProfileHeader';
const links = [['/movies', 'Movies'], ['/tv', 'TV Shows'], ['/watchlist', 'Watchlist'], ['/trending', 'Trending']];
export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState();
    const [searchedQuery, setSearchedQuery] = useState('');
    const [user, setUser] = useState();
    const [scrolled, setScrolled] = useState(false);
    // Solidify the header once the page scrolls under it.
    useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 24); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
    useEffect(() => setMenuOpen(false), [pathname]);
    // Re-check the session on navigation so the navbar updates right after signing in.
    useEffect(() => { apiRequest('/api/auth/me').then(data => setUser(data.user)).catch(() => setUser(null)); }, [pathname]);
    useEffect(() => { const onProfileUpdated = (event) => setUser(event.detail); window.addEventListener('profile-updated', onProfileUpdated); return () => window.removeEventListener('profile-updated', onProfileUpdated); }, []);
    async function logout() {
        setMenuOpen(false);
        await apiRequest('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
        setUser(null);
        router.push('/');
        router.refresh();
    }
    const loginHref = `/login${pathname && !['/', '/login', '/register'].includes(pathname) ? `?next=${encodeURIComponent(pathname)}` : ''}`;
    useEffect(() => {
        const trimmed = query.trim();
        if (trimmed.length < 2) {
            setResults([]);
            setSearchError(undefined);
            setSearching(false);
            return;
        }
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setSearching(true);
            setSearchError(undefined);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal });
                const data = await response.json();
                if (!response.ok)
                    throw new Error(data.error || 'Search failed');
                const validResults = (data.results || []).filter((item) => (item.media_type && item.media_type !== 'person') || item.profile_path).slice(0, 6);
                setResults(validResults);
                setSearchedQuery(trimmed);
            }
            catch (error) {
                if (!controller.signal.aborted)
                    setSearchError(error instanceof Error ? error.message : 'Search failed');
            }
            finally {
                if (!controller.signal.aborted)
                    setSearching(false);
            }
        }, 250);
        return () => { clearTimeout(timer); controller.abort(); };
    }, [query]);
    function submit(event) { event.preventDefault(); const trimmed = query.trim(); if (!trimmed) {
        setSearchError('Enter a movie, show, or person');
        return;
    } setResults([]); router.push(`/search?q=${encodeURIComponent(trimmed)}`); }
    function openResult(item) { setQuery(''); setResults([]); router.push(`/${item.media_type === 'person' ? 'person' : mediaType(item)}/${item.id}`); }
    const noMatches = !searching && !searchError && results.length === 0 && searchedQuery === query.trim();
    const dropdown = query.trim().length >= 2 && (searching || searchError || results.length > 0 || noMatches);
    return <header className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${scrolled ? 'border-white/10 bg-background/95 shadow-[0_8px_30px_rgba(0,0,0,.45)]' : 'border-transparent bg-linear-to-b from-background/90 to-background/40'}`}><div className={`mx-auto flex max-w-screen transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'} items-center justify-between px-5 md:px-16`}><Link href="/" className="rounded bg-gold px-2 py-1 text-xl font-extrabold tracking-tighter text-black hover:scale-105 hover:shadow-[0_0_24px_rgba(245,197,24,.5)]">IMDb</Link><nav className="hidden items-center gap-6 lg:flex xl:gap-8">{links.map(([href, label]) => <Link key={href} href={href} className={`relative whitespace-nowrap py-1 text-sm font-semibold transition hover:text-gold after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100 ${pathname === href ? 'text-gold after:scale-x-100' : 'text-muted after:scale-x-0'}`}>{label}</Link>)}</nav><div className="flex items-center gap-3"><form onSubmit={submit} className="relative hidden sm:block"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted"/><input aria-label="Search IMDb" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search movies..." className="w-40 rounded-full border border-white/10 bg-surface-high py-2 pl-9 pr-4 text-sm transition focus:w-56 focus:border-gold/60 xl:w-48 xl:focus:w-64"/>{dropdown && <div className="anim-slide-down absolute right-0 top-12 w-80 overflow-hidden rounded-xl border border-white/10 bg-surface shadow-2xl">{searching && <p className="flex items-center gap-2 p-4 text-sm text-muted"><LoaderCircle className="h-4 w-4 animate-spin"/>Searching…</p>}{searchError && <p role="alert" className="p-4 text-sm text-red-300">{searchError}</p>}{noMatches && <p role="status" className="p-4 text-sm text-muted">No matches. Press <kbd className="rounded bg-surface-high px-1.5 py-0.5 text-xs text-white">Enter</kbd> to see all results.</p>}{!searching && results.map(item => <button type="button" onClick={() => openResult(item)} key={`${item.media_type}-${item.id}`} className="flex w-full items-center gap-3 border-b border-white/5 p-3 text-left hover:bg-surface-high"><span className="relative h-14 w-10 shrink-0 overflow-hidden rounded"><Image fill sizes="40px" src={image(item.poster_path || item.profile_path, 'w185')} alt="" className="object-cover"/></span><span className="min-w-0"><b className="block truncate text-sm">{title(item)}</b><small className="text-muted">{item.media_type} {year(item) && `• ${year(item)}`}</small></span></button>)}</div>}</form><Link aria-label="Watchlist" href="/watchlist"><Bookmark className="h-5 w-5 text-muted hover:text-gold"/></Link>{user ? <div className="hidden items-center gap-3 md:flex"><Link href="/profile" title="My profile" className={`flex max-w-44 items-center gap-2 text-sm font-semibold hover:text-gold ${pathname === '/profile' ? 'text-gold' : ''}`}><Avatar user={user} className="h-8 w-8 shrink-0 text-sm"/><span className="sr-only xl:not-sr-only xl:truncate">{user.name}</span></Link><button aria-label="Sign out" title="Sign out" onClick={logout} className="text-muted hover:text-gold"><LogOut className="h-5 w-5"/></button></div> : user === null && <Link href={loginHref} className="hidden rounded-full bg-gold px-4 py-2 text-sm font-bold text-black md:block">Sign in</Link>}<button aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">{menuOpen ? <X /> : <Menu />}</button></div></div>{menuOpen && <nav className="anim-slide-down border-t border-white/5 bg-surface px-5 py-4 lg:hidden">{links.map(([href, label]) => <Link key={href} onClick={() => setMenuOpen(false)} className="block py-3 text-muted" href={href}>{label}</Link>)}{user ? <><Link onClick={() => setMenuOpen(false)} href="/profile" className="flex items-center gap-2 py-3 text-muted"><Avatar user={user} className="h-6 w-6 text-xs"/>My Profile</Link><button onClick={logout} className="flex w-full items-center gap-2 py-3 text-left text-muted"><LogOut className="h-4 w-4"/>Sign out</button></> : user === null && <Link onClick={() => setMenuOpen(false)} href={loginHref} className="block py-3 font-semibold text-gold">Sign in</Link>}<form onSubmit={submit} className="mt-2 flex sm:hidden"><input aria-label="Search IMDb" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search IMDb" className="min-w-0 flex-1 rounded-l-lg bg-surface-high p-3"/><button aria-label="Submit search" className="rounded-r-lg bg-gold px-4 text-black"><Search /></button></form>{searchError && <p className="mt-2 text-sm text-red-300">{searchError}</p>}</nav>}</header>;
}
