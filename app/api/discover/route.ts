import {NextRequest,NextResponse} from 'next/server';
import {FEATURED_MOVIES} from '@/lib/featured';
import {discover} from '@/lib/tmdb';

export async function GET(request:NextRequest){
  const search=request.nextUrl.searchParams;
  try{
    const data=await discover({with_genres:search.get('genre')||undefined,sort_by:search.get('sort')||'popularity.desc','vote_average.gte':search.get('rating')||0,page:search.get('page')||1,'vote_count.gte':100});
    if((search.get('page')||'1')==='1'&&!search.get('genre')&&(search.get('rating')||'0')==='0')data.results=[...FEATURED_MOVIES,...data.results.filter(item=>!FEATURED_MOVIES.some(featured=>featured.id===item.id))];
    return NextResponse.json(data);
  }catch{
    return NextResponse.json({page:1,results:FEATURED_MOVIES,total_pages:1,total_results:FEATURED_MOVIES.length});
  }
}
