'use client';
import { Bookmark, LoaderCircle, Play, Share2, Star, X } from 'lucide-react';
import { mediaType, title } from '@/lib/tmdb';
import { apiRequest } from '@/lib/client-api';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
export function Actions({ item, videos = [] }) {
    const [watchlistItem, setWatchlistItem] = useState(null);
    const [trailer, setTrailer] = useState();
    const [rating, setRating] = useState();
    const [ratingInput, setRatingInput] = useState('');
    const [hoveredRating, setHoveredRating] = useState();
    const [ratingOpen, setRatingOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState();
    const [signedIn, setSignedIn] = useState(false);
    const type = mediaType(item);
    const router = useRouter();
    const pathname = usePathname();
    // Signed-out users are sent to sign in, then returned to this title.
    const goToLogin = () => router.push(`/login?next=${encodeURIComponent(pathname)}`);
    const requireLogin = (error) => error?.status === 401 && (setSignedIn(false), goToLogin(), true);
    useEffect(() => {
        let active = true;
        Promise.all([
            apiRequest('/api/auth/me'),
            apiRequest(`/api/watchlist?tmdbId=${item.id}&mediaType=${type}`),
            apiRequest(`/api/ratings/${type}/${item.id}`),
        ]).then(([session, watchlistData, ratingData]) => {
            if (!active)
                return;
            setSignedIn(!!session.user);
            setWatchlistItem(watchlistData.items[0] || null);
            setRating(ratingData.rating?.rating);
            setRatingInput(String(ratingData.rating?.rating || ''));
        }).catch(error => active && setMessage(error instanceof Error ? error.message : 'Persistent features are unavailable')).finally(() => active && setLoading(false));
        return () => { active = false; };
    }, [item.id, type]);
    const closeOverlays = useCallback(() => { setTrailer(undefined); setRatingOpen(false); }, []);
    useEffect(() => { const onKeyDown = (event) => { if (event.key === 'Escape')
        closeOverlays(); }; window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown); }, [closeOverlays]);
    async function toggleWatchlist() {
        if (!signedIn)
            return goToLogin();
        setLoading(true);
        setMessage(undefined);
        try {
            if (watchlistItem) {
                await apiRequest(`/api/watchlist/${watchlistItem._id}`, { method: 'DELETE' });
                setWatchlistItem(null);
                setMessage('Removed from watchlist');
            }
            else {
                const body = { tmdbId: item.id, mediaType: type, title: title(item), posterPath: item.poster_path ?? null, backdropPath: item.backdrop_path ?? null, tmdbRating: item.vote_average, releaseDate: item.release_date || item.first_air_date, overview: item.overview };
                const data = await apiRequest('/api/watchlist', { method: 'POST', body: JSON.stringify(body) });
                setWatchlistItem(data.item);
                setMessage('Added to watchlist');
            }
        }
        catch (error) {
            if (!requireLogin(error))
                setMessage(error instanceof Error ? error.message : 'Watchlist update failed');
        }
        finally {
            setLoading(false);
        }
    }
    async function saveRating(event) {
        event.preventDefault();
        const value = Number(ratingInput);
        if (!Number.isFinite(value) || value < 1 || value > 10) {
            setMessage('Enter a rating between 1 and 10');
            return;
        }
        setLoading(true);
        try {
            await apiRequest('/api/ratings', { method: 'PUT', body: JSON.stringify({ tmdbId: item.id, mediaType: type, rating: value, title: title(item), posterPath: item.poster_path ?? null, releaseDate: item.release_date || item.first_air_date }) });
            setRating(value);
            setRatingOpen(false);
            setMessage('Rating saved');
        }
        catch (error) {
            if (!requireLogin(error))
                setMessage(error instanceof Error ? error.message : 'Rating could not be saved');
        }
        finally {
            setLoading(false);
        }
    }
    async function share() { try {
        if (navigator.share)
            await navigator.share({ title: title(item), url: location.href });
        else {
            await navigator.clipboard.writeText(location.href);
            setMessage('Link copied');
        }
    }
    catch {
        setMessage('Sharing was cancelled');
    } }
    const video = videos.find(candidate => candidate.site === 'YouTube' && candidate.type === 'Trailer');
    const numericRating = Number(ratingInput);
    const ratingInvalid = ratingInput !== '' && (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 10);
    const displayedRating = hoveredRating || (!ratingInvalid && numericRating) || 0;
    return <>
    <div className="flex flex-wrap gap-3">
      <button onClick={() => video ? setTrailer(video.key) : setMessage('Trailer unavailable')} className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-black shadow-[0_8px_24px_-8px_rgba(245,197,24,.6)] transition hover:scale-105 hover:shadow-[0_10px_30px_-6px_rgba(245,197,24,.75)]"><Play className="fill-current"/>Watch Trailer</button>
      <button disabled={loading} onClick={toggleWatchlist} className="flex items-center gap-2 rounded-full border border-white/20 bg-surface/70 px-5 py-3 hover:border-gold/60 hover:text-gold disabled:opacity-60">{loading ? <LoaderCircle className="animate-spin"/> : <Bookmark className={watchlistItem ? 'fill-gold text-gold' : ''}/>} {watchlistItem ? 'In Watchlist' : signedIn || loading ? 'Add to Watchlist' : 'Sign in to add to Watchlist'}</button>
      <button disabled={loading} onClick={() => signedIn ? setRatingOpen(true) : goToLogin()} className="flex items-center gap-2 rounded-full bg-surface-high px-5 py-3 hover:bg-surface-highest hover:text-gold disabled:opacity-60"><Star className={rating ? 'fill-gold text-gold' : ''}/>{rating ? `Your rating: ${rating}` : signedIn || loading ? 'Rate' : 'Sign in to rate'}</button>
      <button aria-label="Share" onClick={share} className="rounded-full bg-surface-high p-3 hover:bg-surface-highest hover:text-gold"><Share2 /></button>
    </div>
    {message && <p key={message} role="status" className="anim-slide-down mt-3 w-fit rounded-lg bg-surface-high px-4 py-2 text-sm text-muted">{message}</p>}
    {trailer && <div onClick={closeOverlays} className="anim-fade-in fixed inset-0 z-100 grid place-items-center bg-black/90 p-4"><div onClick={event => event.stopPropagation()} className="anim-scale-in relative aspect-video w-full max-w-5xl"><button aria-label="Close trailer" onClick={closeOverlays} className="absolute -top-12 right-0"><X /></button><iframe className="h-full w-full rounded-xl" src={`https://www.youtube.com/embed/${trailer}?autoplay=1`} title="Trailer" allow="autoplay; encrypted-media" allowFullScreen/></div></div>}
    {ratingOpen && <div onClick={closeOverlays} className="anim-fade-in fixed inset-0 z-100 grid place-items-center bg-black/75 p-5 backdrop-blur-2xl"><form onClick={event => event.stopPropagation()} onSubmit={saveRating} className="anim-scale-in relative w-full max-w-[460px] overflow-hidden rounded-[20px] border border-[#3a393a] bg-surface-low shadow-[0_20px_40px_rgba(0,0,0,0.55)]"><div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/50 to-transparent"/><button type="button" aria-label="Close rating" onClick={closeOverlays} className="absolute right-5 top-5 z-10 rounded-full p-2 text-muted transition hover:bg-white/5 hover:text-white"><X className="h-5 w-5"/></button><div className="flex flex-col gap-7 p-6 pt-9 sm:p-8"><header className="flex flex-col items-center gap-2 px-8 text-center"><span className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Rate This Title</span><h2 className="text-2xl font-bold leading-tight sm:text-3xl">{title(item)}</h2><p className="text-sm text-muted">{item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || type.toUpperCase()} • {item.genres?.slice(0, 2).map(genre => genre.name).join(' • ') || 'IMDb Reimagined'}</p></header><div className="flex flex-col items-center gap-4"><div onMouseLeave={() => setHoveredRating(undefined)} className="flex w-full justify-center gap-0.5 sm:gap-1" role="radiogroup" aria-label="Choose a rating from 1 to 10">{Array.from({ length: 10 }, (_, index) => index + 1).map(value => <button key={value} type="button" role="radio" aria-checked={numericRating === value} aria-label={`${value} out of 10`} onMouseEnter={() => setHoveredRating(value)} onFocus={() => setHoveredRating(value)} onBlur={() => setHoveredRating(undefined)} onClick={() => { setRatingInput(String(value)); setHoveredRating(undefined); }} className="group p-0.5 transition-transform hover:scale-125 focus:scale-125 sm:p-1"><Star className={`h-6 w-6 transition-colors sm:h-8 sm:w-8 ${value <= displayedRating ? 'fill-gold text-gold' : 'fill-[#3a393a] text-[#3a393a] group-hover:text-gold'}`}/></button>)}</div><div className="flex items-baseline gap-2"><span className="text-5xl font-extrabold text-gold">{displayedRating || '—'}</span><span className="text-xl font-semibold text-[#656365]">/ 10</span></div></div><div className="border-t border-[#3a393a] pt-5"><label htmlFor="rating" className={`text-sm font-medium ${ratingInvalid ? 'text-[#ffb4ab]' : 'text-muted'}`}>Or enter a rating</label><div className="mt-2 flex items-center gap-3"><input id="rating" required inputMode="decimal" type="number" min="1" max="10" step="0.5" value={ratingInput} onChange={event => setRatingInput(event.target.value)} className={`w-24 rounded-lg bg-surface px-3 py-2 text-center text-lg focus:ring-1 ${ratingInvalid ? 'border border-[#ffb4ab] text-[#ffb4ab] focus:ring-[#ffb4ab]' : 'border border-[#3a393a] focus:border-gold focus:ring-gold'}`}/><span className="text-sm text-muted">/ 10</span></div>{ratingInvalid && <p role="alert" className="mt-2 flex items-center gap-1 text-sm text-[#ffb4ab]"><span className="grid h-4 w-4 place-items-center rounded-full border border-current text-[10px] font-bold">!</span>Enter a rating between 1 and 10.</p>}</div><div className="flex items-center justify-end gap-3"><button type="button" onClick={closeOverlays} className="rounded-lg px-6 py-3 text-sm font-semibold text-muted transition hover:bg-white/5 hover:text-white">Cancel</button><button disabled={loading || ratingInvalid || !ratingInput} className="rounded-lg bg-gold px-6 py-3 font-bold text-black shadow-[0_4px_14px_rgba(245,197,24,0.2)] transition hover:bg-[#ffe08b] disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Saving…' : 'Save Rating'}</button></div></div></form></div>}
  </>;
}
