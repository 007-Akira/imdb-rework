import {NextResponse} from 'next/server';
import {DEMO_USER_ID,RATINGS_COLLECTION} from '@/lib/constants';
import {getDatabase} from '@/lib/mongodb';
import {isContentType,isPositiveInteger} from '@/lib/validation';

export async function GET(_:Request,{params}:{params:Promise<{mediaType:string;tmdbId:string}>}){
  try{
    const {mediaType,tmdbId:rawId}=await params;const tmdbId=Number(rawId);
    if(!isContentType(mediaType)||!isPositiveInteger(tmdbId))return NextResponse.json({error:'Invalid media type or TMDB ID'},{status:400});
    const db=await getDatabase();const rating=await db.collection(RATINGS_COLLECTION).findOne({userId:DEMO_USER_ID,tmdbId,mediaType});
    if(!rating)return NextResponse.json({rating:null});
    return NextResponse.json({rating});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Unable to read rating'},{status:503})}
}
