import {NextRequest,NextResponse} from 'next/server';
import {search} from '@/lib/tmdb';

export async function GET(request:NextRequest){
  const query=request.nextUrl.searchParams.get('q')?.trim()||'';
  if(query.length<2)return NextResponse.json({results:[],error:query?'Enter at least two characters':'Enter a search query'},{status:400});
  try{return NextResponse.json(await search(query))}
  catch(error){return NextResponse.json({results:[],error:error instanceof Error?error.message:'Search is temporarily unavailable'},{status:503})}
}
