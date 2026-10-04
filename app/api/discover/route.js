import { NextResponse } from 'next/server';
import { FEATURED_MOVIES } from '@/lib/featured';
import { discoverMovies, normalizeFilters } from '@/lib/discover';
export async function GET(request) {
    const search = request.nextUrl.searchParams;
    const page = Math.min(Math.max(Number(search.get('page')) || 1, 1), 500);
    try {
        return NextResponse.json(await discoverMovies(normalizeFilters(search), page));
    }
    catch {
        return NextResponse.json({ page: 1, results: FEATURED_MOVIES, total_pages: 1, total_results: FEATURED_MOVIES.length });
    }
}
