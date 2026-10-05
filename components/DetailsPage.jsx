import Image from 'next/image';
import Carousel from './Carousel';
import HeroVideo from './HeroVideo';
import { Actions } from './ClientActions';
import { BACKGROUND_VIDEOS } from '@/lib/featured';
import { image, pickTrailer, title, year } from '@/lib/tmdb';
export default function DetailsPage({ item, type }) {
    const director = item.credits?.crew.find(x => x.job === 'Director');
    // Hand-picked clips win; otherwise use the title's own YouTube trailer.
    const backgroundVideo = BACKGROUND_VIDEOS[item.id] || pickTrailer(item.videos?.results)?.key;
    return <main>
    <section className="relative min-h-[700px] overflow-hidden px-5 pb-16 pt-36 md:px-16">
      <Image preload fill sizes="100vw" src={image(item.backdrop_path, 'original')} alt="" className="ken-burns object-cover opacity-60"/>
      {backgroundVideo && <HeroVideo key={backgroundVideo} videoId={backgroundVideo}/>}<div className="hero-mask absolute inset-0"/>
      <div className="relative mx-auto flex max-w-screen items-end gap-10">
        <div className="anim-scale-in shimmer relative hidden aspect-2/3 w-64 shrink-0 overflow-hidden rounded-xl shadow-2xl md:block"><Image fill sizes="256px" src={image(item.poster_path)} alt={`${title(item)} poster`} className="object-cover"/></div>
        <div className="max-w-3xl"><p className="anim-fade-up mb-3 font-semibold text-gold">{item.genres?.map(g => g.name).join('  •  ')}</p><h1 className="anim-fade-up delay-1 text-5xl font-extrabold md:text-7xl">{title(item)}</h1><p className="anim-fade-up delay-2 mt-3 text-muted">{year(item)}　•　{type === 'movie' && item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : 'TV Series'}　•　★ {item.vote_average?.toFixed(1)} ({item.vote_count?.toLocaleString()} votes)</p><p className="anim-fade-up delay-2 my-7 max-w-2xl text-lg leading-8 text-gray-300">{item.overview || 'No overview is available.'}</p>{director && <p className="anim-fade-up delay-3 mb-6 text-sm"><b>Director</b>　<span className="text-muted">{director.name}</span></p>}<div className="anim-fade-up delay-4"><Actions item={{ ...item, media_type: type }} videos={item.videos?.results}/></div></div>
      </div>
    </section>
    <div className="mx-auto flex max-w-screen flex-col gap-20 px-5 py-16 md:px-16">{item.credits?.cast?.length ? <Carousel title="Top Cast" items={item.credits.cast.slice(0, 20).map(x => ({ ...x, media_type: 'person' }))}/> : null}{item.recommendations?.results?.length ? <Carousel title="More Like This" items={item.recommendations.results.map(x => ({ ...x, media_type: type }))}/> : null}</div>
  </main>;
}
