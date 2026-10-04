import Explore from '@/components/Explore';
import { FEATURED_MOVIES } from '@/lib/featured';
import { discoverMovies, normalizeFilters } from '@/lib/discover';
import { genres } from '@/lib/tmdb';
export const metadata = { title: 'Explore Movies' };
export default async function Page({ searchParams }) {
    // Filters live in the URL (?genre=27&sort=vote_average.desc), so filtered views can be bookmarked and shared.
    const filters = normalizeFilters(await searchParams);
    let data = { page: 1, results: FEATURED_MOVIES, total_pages: 1, total_results: FEATURED_MOVIES.length };
    let gs = { genres: [] };
    try {
        [data, gs] = await Promise.all([discoverMovies(filters), genres()]);
    }
    catch { }
    return <main className="mx-auto min-h-screen max-w-screen px-5 pt-32 md:px-16">
    <p className="text-sm font-bold uppercase tracking-widest text-gold">Discover</p>
    <h1 className="mb-10 mt-2 text-4xl font-extrabold md:text-6xl">Explore Movies</h1>
    <Explore key={JSON.stringify(filters)} initial={data.results} initialTotalPages={data.total_pages} initialFilters={filters} genreList={gs.genres}/>
  </main>;
}
