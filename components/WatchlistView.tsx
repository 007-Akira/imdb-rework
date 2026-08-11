'use client';

import {useEffect,useMemo,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {LoaderCircle,Star,Trash2} from 'lucide-react';
import {WatchlistItem} from '@/lib/types';
import {image} from '@/lib/tmdb';
import {apiRequest} from '@/lib/client-api';

type SortOption='recent'|'rating'|'year';

export default function WatchlistView(){
  const [items,setItems]=useState<WatchlistItem[]>([]);
  const [sort,setSort]=useState<SortOption>('recent');
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string>();
  const [removingId,setRemovingId]=useState<string>();

  useEffect(()=>{apiRequest<{items:WatchlistItem[]}>('/api/watchlist').then(data=>setItems(data.items)).catch(error=>setError(error instanceof Error?error.message:'Unable to load watchlist')).finally(()=>setLoading(false))},[]);
  const shown=useMemo(()=>[...items].sort((a,b)=>{
    if(sort==='rating')return (b.tmdbRating||0)-(a.tmdbRating||0);
    if(sort==='year')return (b.releaseDate||'').localeCompare(a.releaseDate||'');
    return new Date(b.addedAt).getTime()-new Date(a.addedAt).getTime();
  }),[items,sort]);

  async function remove(item:WatchlistItem){
    setRemovingId(item._id);setError(undefined);
    try{await apiRequest(`/api/watchlist/${item._id}`,{method:'DELETE'});setItems(current=>current.filter(candidate=>candidate._id!==item._id))}
    catch(error){setError(error instanceof Error?error.message:'Unable to remove item')}finally{setRemovingId(undefined)}
  }

  if(loading)return <div className="grid min-h-64 place-items-center rounded-2xl bg-surface"><LoaderCircle className="animate-spin text-gold"/></div>;
  if(!items.length)return <div className="rounded-2xl bg-surface p-16 text-center"><h2 className="text-2xl font-bold">Your watchlist is waiting</h2><p className="mt-3 text-muted">{error||'Save movies and shows to find them here.'}</p><Link href="/movies" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 font-bold text-black">Explore movies</Link></div>;
  return <><div className="mb-8 flex flex-wrap items-center justify-between gap-4">{error?<p role="alert" className="text-sm text-red-300">{error}</p>:<span className="text-sm text-muted">{items.length} saved {items.length===1?'title':'titles'}</span>}<select aria-label="Sort watchlist" value={sort} onChange={event=>setSort(event.target.value as SortOption)} className="rounded-lg bg-surface-high p-3"><option value="recent">Recently Added</option><option value="rating">Highest Rating</option><option value="year">Release Year</option></select></div><div className="grid gap-5 lg:grid-cols-2">{shown.map(item=><article key={item._id} className="flex overflow-hidden rounded-xl border border-white/5 bg-surface-high"><Link className="relative w-32 shrink-0 sm:w-44" href={`/${item.mediaType}/${item.tmdbId}`}><Image fill src={image(item.posterPath)} alt={item.title} className="object-cover"/></Link><div className="flex min-w-0 flex-1 flex-col p-5"><Link href={`/${item.mediaType}/${item.tmdbId}`} className="truncate text-xl font-bold hover:text-gold">{item.title}</Link><p className="mt-2 flex items-center gap-1 text-sm text-gold"><Star className="h-4 w-4 fill-current"/>{item.tmdbRating?.toFixed(1)||'—'}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{item.overview}</p><button disabled={removingId===item._id} onClick={()=>remove(item)} className="mt-auto flex w-fit items-center gap-2 pt-5 text-sm text-muted hover:text-red-400 disabled:opacity-50">{removingId===item._id?<LoaderCircle className="h-4 w-4 animate-spin"/>:<Trash2 className="h-4 w-4"/>}Remove</button></div></article>)}</div></>;
}
