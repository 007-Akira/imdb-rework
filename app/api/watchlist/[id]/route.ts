import {NextResponse} from 'next/server';
import {ObjectId} from 'mongodb';
import {DEMO_USER_ID,WATCHLIST_COLLECTION} from '@/lib/constants';
import {getDatabase} from '@/lib/mongodb';

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {id}=await params;
    if(!ObjectId.isValid(id))return NextResponse.json({error:'Invalid watchlist document ID'},{status:400});
    const db=await getDatabase();
    const result=await db.collection(WATCHLIST_COLLECTION).deleteOne({_id:new ObjectId(id),userId:DEMO_USER_ID});
    if(!result.deletedCount)return NextResponse.json({error:'Watchlist item not found'},{status:404});
    return NextResponse.json({deleted:true});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Unable to remove item'},{status:503})}
}
