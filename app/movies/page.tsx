import Explore from '@/components/Explore';
import {FEATURED_MOVIES} from '@/lib/featured';
import {discover,genres} from '@/lib/tmdb';
import {Media,PageResult} from '@/lib/types';

export const metadata={title:'Explore Movies'};

export default async function Page(){
  let data:PageResult={page:1,results:[],total_pages:0,total_results:0};
  let gs:{genres:{id:number;name:string}[]}={genres:[]};
  try{[data,gs]=await Promise.all([discover({sort_by:'popularity.desc'}),genres()])}catch{}
  const movies=[...FEATURED_MOVIES,...data.results.filter(item=>!FEATURED_MOVIES.some(featured=>featured.id===item.id))];
  return <main className="mx-auto min-h-screen max-w-screen px-5 pt-32 md:px-16">
    <p className="text-sm font-bold uppercase tracking-widest text-gold">Discover</p>
    <h1 className="mb-10 mt-2 text-4xl font-extrabold md:text-6xl">Explore Movies</h1>
    <Explore initial={movies as Media[]} genreList={gs.genres}/>
  </main>
}
