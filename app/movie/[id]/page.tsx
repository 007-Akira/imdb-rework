import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import DetailsPage from '@/components/DetailsPage';
import {featuredDetails} from '@/lib/featured';
import {details,title} from '@/lib/tmdb';

export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{
  const id=(await params).id;
  try{const movie=await details('movie',id);return {title:title(movie)}}catch{return {title:title(featuredDetails(Number(id))||{id:Number(id),title:'Movie'})}}
}

export default async function Page({params}:{params:Promise<{id:string}>}){
  const id=(await params).id;
  try{return <DetailsPage item={await details('movie',id)} type="movie"/>}catch{const fallback=featuredDetails(Number(id));if(fallback)return <DetailsPage item={fallback} type="movie"/>;notFound()}
}
