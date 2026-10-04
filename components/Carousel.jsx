'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from './Card';
import Reveal from './Reveal';
export default function Carousel({ title, items, ranked = false }) {
    const ref = useRef(null);
    const [edges, setEdges] = useState({ start: true, end: false });
    const move = (d) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' });
    // Track whether the row can scroll further in each direction so the arrows can dim.
    function updateEdges() {
        const node = ref.current;
        if (node)
            setEdges({ start: node.scrollLeft <= 4, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 4 });
    }
    useEffect(() => { updateEdges(); window.addEventListener('resize', updateEdges); return () => window.removeEventListener('resize', updateEdges); }, [items]);
    const arrowClass = 'rounded-full bg-surface-high p-2 hover:bg-gold hover:text-black disabled:opacity-30 disabled:hover:bg-surface-high disabled:hover:text-current';
    return <Reveal as="section"><div className="mb-6 flex items-center justify-between"><h2 className="text-2xl font-bold md:text-3xl"><span className="mr-3 text-gold">|</span>{title}</h2><div className="flex gap-2"><button aria-label="Previous" disabled={edges.start} onClick={() => move(-1)} className={arrowClass}><ChevronLeft /></button><button aria-label="Next" disabled={edges.end} onClick={() => move(1)} className={arrowClass}><ChevronRight /></button></div></div><div ref={ref} onScroll={updateEdges} className="no-scrollbar edge-fade -my-4 flex snap-x gap-5 overflow-x-auto px-1 py-4">{items.map((x, i) => <Card key={`${x.media_type}-${x.id}`} item={x} rank={ranked ? i + 1 : undefined}/>)}</div></Reveal>;
}
