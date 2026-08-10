import Image from 'next/image';
import Carousel from './Carousel';
import HeroVideo from './HeroVideo';
import {Actions} from './ClientActions';
import {BACKGROUND_VIDEOS} from '@/lib/featured';
import {Details} from '@/lib/types';
import {image,title,year} from '@/lib/tmdb';

export default function DetailsPage({item,type}:{item:Details;type:'movie'|'tv'}){
  const director=item.credits?.crew.find(x=>x.job==='Director');
  const backgroundVideo=BACKGROUND_VIDEOS[item.id];
  return <main>
    <section className="relative min-h-[700px] overflow-hidden px-5 pb-16 pt-36 md:px-16">
      <Image priority fill src={image(item.backdrop_path,'original')} alt="" className="object-cover opacity-60"/>
      {backgroundVideo&&<HeroVideo videoId={backgroundVideo}/>}<div className="hero-mask absolute inset-0"/>
      <div className="relative mx-auto flex max-w-screen items-end gap-10">
        <div className="relative hidden aspect-[2/3] w-64 shrink-0 overflow-hidden rounded-xl shadow-2xl md:block"><Image fill src={image(item.poster_path)} alt={`${title(item)} poster`} className="object-cover"/></div>
        <div className="max-w-3xl"><p className="mb-3 font-semibold text-gold">{item.genres?.map(g=>g.name).join('  •  ')}</p><h1 className="text-5xl font-extrabold md:text-7xl">{title(item)}</h1><p className="mt-3 text-muted">{year(item)}　•　{type==='movie'&&item.runtime?`${Math.floor(item.runtime/60)}h ${item.runtime%60}m`:'TV Series'}　•　★ {item.vote_average?.toFixed(1)} ({item.vote_count?.toLocaleString()} votes)</p><p className="my-7 max-w-2xl text-lg leading-8 text-gray-300">{item.overview||'No overview is available.'}</p>{director&&<p className="mb-6 text-sm"><b>Director</b>　<span className="text-muted">{director.name}</span></p>}<Actions item={{...item,media_type:type}} videos={item.videos?.results}/></div>
      </div>
    </section>
    <div className="mx-auto flex max-w-screen flex-col gap-20 px-5 py-16 md:px-16">{item.credits?.cast?.length?<Carousel title="Top Cast" items={item.credits.cast.slice(0,20).map(x=>({...x,media_type:'person'}))}/>:null}{item.recommendations?.results?.length?<Carousel title="More Like This" items={item.recommendations.results.map(x=>({...x,media_type:type}))}/>:null}</div>
  </main>
}
