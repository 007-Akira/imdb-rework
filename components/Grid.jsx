import Card from './Card';
const GRID = 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
// preloadCount: how many leading posters load eagerly; the default covers the first row on wide screens.
export default function Grid({ items, preloadCount = 5 }) { return <div className={GRID}>{items.map((x, i) => <div key={`${x.media_type}-${x.id}`} className="anim-fade-up" style={{ animationDelay: `${(i % 20) * 45}ms` }}><Card item={x} score={x.score} variant="grid" preload={i < preloadCount}/></div>)}</div>; }
// Shimmer placeholders with the same layout as Grid, shown while results load.
export function GridSkeleton({ count = 10 }) { return <div aria-hidden className={GRID}>{Array.from({ length: count }, (_, i) => <div key={i} className="shimmer aspect-2/3 rounded-xl" style={{ animationDelay: `${i * 80}ms` }}/>)}</div>; }
