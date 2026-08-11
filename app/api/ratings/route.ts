import {NextResponse} from 'next/server';
import {DEMO_USER_ID,RATINGS_COLLECTION} from '@/lib/constants';
import {getDatabase} from '@/lib/mongodb';
import {isContentType,isPositiveInteger,isValidRating,parseJsonError} from '@/lib/validation';

export async function GET(){
  try{const db=await getDatabase();const ratings=await db.collection(RATINGS_COLLECTION).find({userId:DEMO_USER_ID}).sort({updatedAt:-1}).toArray();return NextResponse.json({ratings})}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Unable to read ratings'},{status:503})}
}

export async function PUT(request:Request){
  try{
    const body=await request.json();
    if(!isPositiveInteger(body.tmdbId)||!isContentType(body.mediaType)||!isValidRating(body.rating))return NextResponse.json({error:'tmdbId and mediaType are required; rating must be between 1 and 10'},{status:400});
    const db=await getDatabase();const collection=db.collection(RATINGS_COLLECTION);
    await collection.createIndex({userId:1,tmdbId:1,mediaType:1},{unique:true});
    const now=new Date();
    await collection.updateOne({userId:DEMO_USER_ID,tmdbId:body.tmdbId,mediaType:body.mediaType},{$set:{rating:body.rating,updatedAt:now},$setOnInsert:{createdAt:now}},{upsert:true});
    const rating=await collection.findOne({userId:DEMO_USER_ID,tmdbId:body.tmdbId,mediaType:body.mediaType});
    return NextResponse.json({rating});
  }catch(error){const invalidJson=error instanceof SyntaxError;return NextResponse.json({error:parseJsonError(error)},{status:invalidJson?400:503})}
}

export const POST=PUT;
