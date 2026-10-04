import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { image, mediaType, title, year } from '@/lib/tmdb';
// Carousel cards have a fixed width; grid cards fill their column, so they request a size matching the grid layout.
const VARIANTS = {
    carousel: { className: 'w-[190px] shrink-0 snap-start md:w-[225px]', sizes: '(min-width: 768px) 225px, 190px' },
    grid: { className: 'w-full', sizes: '(min-width: 1440px) 260px, (min-width: 1280px) 20vw, (min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw' },
};
// Hover and keyboard focus share the same lift + gold glow so Tab users can see where they are.
const LIFT = 'hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_18px_40px_-14px_rgba(245,197,24,.45)] focus-visible:-translate-y-1.5 focus-visible:border-gold focus-visible:shadow-[0_18px_40px_-14px_rgba(245,197,24,.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
// score overrides the TMDB rating badge, e.g. with the signed-in user's own rating. preload marks above-the-fold posters.
export default function Card({ item, rank, score, variant = 'carousel', preload = false }) {
    const type = item.media_type === 'person' ? 'person' : mediaType(item);
    const src = item.poster_path || item.profile_path;
    const { className, sizes } = VARIANTS[variant];
    const rating = score !== undefined ? `Your rating ${score} out of 10` : item.vote_average ? `Rated ${item.vote_average.toFixed(1)} out of 10` : 'Not yet rated';
    return <Link href={`/${type}/${item.id}`} className={`group relative block overflow-hidden rounded-xl border border-white/5 bg-surface duration-300 active:scale-[.98] ${LIFT} ${className}`}><div className="shimmer relative aspect-2/3 overflow-hidden"><Image src={image(src)} alt={`${title(item)} poster`} fill sizes={sizes} preload={preload} className="object-cover transition duration-700 group-hover:scale-110 group-focus-visible:scale-110"/><div className="card-mask absolute inset-0"/>{rank && <b aria-hidden className="absolute -left-1 bottom-5 text-8xl text-white/20">{rank}</b>} {type !== 'person' && <span className="absolute left-3 top-3 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs font-bold text-gold"><Star aria-hidden className="h-3 w-3 fill-current"/><span aria-hidden>{score !== undefined ? <>Your {score}</> : item.vote_average?.toFixed(1) || '—'}</span><span className="sr-only">{rating}</span></span>}<div className="absolute inset-x-0 bottom-0 p-4"><h3 className="truncate font-semibold group-hover:text-gold group-focus-visible:text-gold">{title(item)}</h3><p className="mt-1 text-xs text-muted">{type === 'person' ? item.known_for_department : (year(item) || type.toUpperCase())}</p></div></div></Link>;
}
