import { FEATURED_MOVIES } from './featured';
import { discover } from './tmdb';
export const SORT_OPTIONS = [['popularity.desc', 'Most Popular'], ['vote_average.desc', 'Highest Rated'], ['primary_release_date.desc', 'Newest Releases']];
export const RATING_OPTIONS = [['0', 'Any rating'], ['7', '7+ rating'], ['8', '8+ rating']];
export const DEFAULT_FILTERS = { genre: '', sort: 'popularity.desc', rating: '0' };
// Accepts URLSearchParams or a plain object and drops anything not in the allowed lists,
// so hand-edited URLs fall back to defaults instead of producing bad TMDB requests.
export function normalizeFilters(params) {
    const get = (key) => { const value = typeof params?.get === 'function' ? params.get(key) : params?.[key]; return Array.isArray(value) ? value[0] : value; };
    const genre = get('genre'), sort = get('sort'), rating = get('rating');
    return {
        genre: /^\d{1,6}$/.test(genre || '') ? genre : DEFAULT_FILTERS.genre,
        sort: SORT_OPTIONS.some(([value]) => value === sort) ? sort : DEFAULT_FILTERS.sort,
        rating: RATING_OPTIONS.some(([value]) => value === rating) ? rating : DEFAULT_FILTERS.rating,
    };
}
// Only non-default filters go in the URL, so the unfiltered page stays at plain /movies.
export function filtersToQuery(filters) {
    const query = new URLSearchParams();
    for (const key of ['genre', 'rating', 'sort'])
        if (filters[key] !== DEFAULT_FILTERS[key])
            query.set(key, filters[key]);
    return query.toString();
}
export async function discoverMovies(filters, page = 1) {
    const data = await discover({ with_genres: filters.genre || undefined, sort_by: filters.sort, 'vote_average.gte': filters.rating, page, 'vote_count.gte': 100 });
    const unfiltered = page === 1 && !filters.genre && filters.rating === DEFAULT_FILTERS.rating;
    if (unfiltered)
        data.results = [...FEATURED_MOVIES, ...data.results.filter(item => !FEATURED_MOVIES.some(featured => featured.id === item.id))];
    return data;
}
