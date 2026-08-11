import {NextRequest,NextResponse} from 'next/server';
import {MongoServerError} from 'mongodb';
import {DEMO_USER_ID,WATCHLIST_COLLECTION} from '@/lib/constants';
import {getDatabase} from '@/lib/mongodb';
import {isContentType,isNonEmptyString,isPositiveInteger,parseJsonError} from '@/lib/validation';

export async function GET(request:NextRequest){
  try{
    const db=await getDatabase();
    const collection=db.collection(WATCHLIST_COLLECTION);
    await collection.createIndex({userId:1,tmdbId:1,mediaType:1},{unique:true});
    const tmdbId=Number(request.nextUrl.searchParams.get('tmdbId'));
    const mediaType=request.nextUrl.searchParams.get('mediaType');
    const query:Record<string,unknown>={userId:DEMO_USER_ID};
    if(isPositiveInteger(tmdbId)&&isContentType(mediaType))Object.assign(query,{tmdbId,mediaType});
    const items=await collection.find(query).sort({addedAt:-1}).toArray();
    return NextResponse.json({items});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:'Unable to read watchlist'},{status:503});
  }
}

export async function POST(request:NextRequest){
  try{
    const body=await request.json();
    if(!isPositiveInteger(body.tmdbId)||!isContentType(body.mediaType)||!isNonEmptyString(body.title))return NextResponse.json({error:'tmdbId, mediaType, and title are required'},{status:400});
    const db=await getDatabase();
    const collection=db.collection(WATCHLIST_COLLECTION);
    await collection.createIndex({userId:1,tmdbId:1,mediaType:1},{unique:true});
    const document={userId:DEMO_USER_ID,tmdbId:body.tmdbId,mediaType:body.mediaType,title:body.title.trim(),posterPath:body.posterPath??null,backdropPath:body.backdropPath??null,tmdbRating:typeof body.tmdbRating==='number'?body.tmdbRating:undefined,releaseDate:body.releaseDate||undefined,overview:body.overview||undefined,addedAt:new Date()};
    const result=await collection.insertOne(document);
    return NextResponse.json({item:{...document,_id:result.insertedId}},{status:201});
  }catch(error){
    if(error instanceof MongoServerError&&error.code===11000)return NextResponse.json({error:'This title is already in the watchlist'},{status:409});
    const invalidJson=error instanceof SyntaxError;
    return NextResponse.json({error:parseJsonError(error)},{status:invalidJson?400:503});
  }
}
