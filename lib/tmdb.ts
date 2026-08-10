import {Details,Media,PageResult} from './types';
const BASE='https://api.themoviedb.org/3';
const key=process.env.TMDB_API_KEY;
async function request<T>(path:string,params:Record<string,string|number|undefined>={}):Promise<T>{
  if(!key) throw new Error('TMDB_API_KEY is not configured');
  const url=new URL(BASE+path); Object.entries({...params,language:'en-US'}).forEach(([k,v])=>v!==undefined&&url.searchParams.set(k,String(v)));
  const isBearer=key.split('.').length===3;
  if(!isBearer) url.searchParams.set('api_key',key);
  const res=await fetch(url,{headers:{...(isBearer?{Authorization:`Bearer ${key}`}:{ }),accept:'application/json'},next:{revalidate:1800}});
  if(!res.ok) throw new Error(`TMDB request failed (${res.status})`); return res.json();
}
export const image=(path?:string|null,size='w500')=>path?`https://image.tmdb.org/t/p/${size}${path}`:'/placeholder.svg';
export const title=(m:Media)=>m.title||m.name||m.original_name||'Untitled';
export const year=(m:Media)=>(m.release_date||m.first_air_date||'').slice(0,4);
export const mediaType=(m:Media):'movie'|'tv'=>m.media_type==='tv'||(!m.title&&!!m.name)?'tv':'movie';
export async function homeData(){return Promise.all([request<PageResult>('/trending/all/week'),request<PageResult>('/movie/popular'),request<PageResult>('/movie/top_rated'),request<PageResult>('/movie/upcoming'),request<PageResult>('/tv/popular')]);}
export const details=async(type:'movie'|'tv',id:string)=>request<Details>(`/${type}/${id}`,{append_to_response:'credits,videos,recommendations'});
export const person=async(id:string)=>request<Details>(`/person/${id}`,{append_to_response:'combined_credits,images'});
export const search=(q:string,page=1)=>request<PageResult>('/search/multi',{query:q,page,include_adult:'false'});
export const trending=(window:'day'|'week')=>request<PageResult>(`/trending/all/${window}`);
export const genres=()=>request<{genres:{id:number;name:string}[]}>('/genre/movie/list');
export const discover=(params:Record<string,string|number|undefined>)=>request<PageResult>('/discover/movie',params);
