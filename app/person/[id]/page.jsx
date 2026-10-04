import Image from 'next/image';
import Carousel from '@/components/Carousel';
import { image, person, title } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
export default async function Page({ params }) { try {
    const p = await person((await params).id);
    const credits = (p.combined_credits?.cast || []).filter((x, i, a) => a.findIndex(y => y.id === x.id) === i).sort((a, b) => (b.release_date || b.first_air_date || '').localeCompare(a.release_date || a.first_air_date || ''));
    return <main className="mx-auto min-h-screen max-w-screen px-5 pt-32 md:px-16"><section className="grid gap-10 md:grid-cols-[300px_1fr]"><div className="relative aspect-2/3 overflow-hidden rounded-2xl"><Image fill preload src={image(p.profile_path)} alt={title(p)} className="object-cover"/></div><div><p className="font-bold text-gold">{p.known_for_department}</p><h1 className="mt-2 text-5xl font-extrabold md:text-7xl">{title(p)}</h1><div className="my-6 flex flex-wrap gap-5 text-sm text-muted"><span>Born: {p.birthday || 'Unknown'}</span><span>{p.place_of_birth}</span></div><h2 className="mb-3 text-xl font-bold">Biography</h2><p className="max-w-3xl whitespace-pre-line leading-7 text-gray-300">{p.biography || 'No biography is available.'}</p></div></section>{credits.length ? <div className="mt-20"><Carousel title="Known For & Filmography" items={credits.slice(0, 30)}/></div> : null}</main>;
}
catch {
    notFound();
} }
