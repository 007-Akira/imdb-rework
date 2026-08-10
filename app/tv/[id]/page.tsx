import {notFound} from 'next/navigation';import DetailsPage from '@/components/DetailsPage';import {details} from '@/lib/tmdb';
export default async function Page({params}:{params:Promise<{id:string}>}){try{return <DetailsPage item={await details('tv',(await params).id)} type="tv"/>}catch{notFound()}}
