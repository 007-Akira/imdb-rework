const BASE = 'https://api.themoviedb.org/3';
const key = process.env.TMDB_API_KEY;
async function request(path, params = {}) {
    if (!key)
        throw new Error('TMDB_API_KEY is not configured');
    const url = new URL(BASE + path);
    Object.entries({ ...params, language: 'en-US' }).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, String(v)));
    const isBearer = key.split('.').length === 3;
    if (!isBearer)
        url.searchParams.set('api_key', key);
    const res = await fetch(url, { headers: { ...(isBearer ? { Authorization: `Bearer ${key}` } : {}), accept: 'application/json' }, next: { revalidate: 1800 } });
    if (!res.ok)
        throw new Error(`TMDB request failed (${res.status})`);
    return res.json();
}
export const image = (path, size = 'w500') => path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder.svg';
export const title = (m) => m.title || m.name || m.original_name || 'Untitled';
export const year = (m) => (m.release_date || m.first_air_date || '').slice(0, 4);
export const mediaType = (m) => m.media_type === 'tv' || (!m.title && !!m.name) ? 'tv' : 'movie';
export async function homeData() { return Promise.all([request('/trending/all/week'), request('/movie/popular'), request('/movie/top_rated'), request('/movie/upcoming'), request('/tv/popular')]); }
export const details = async (type, id) => request(`/${type}/${id}`, { append_to_response: 'credits,videos,recommendations' });
export const person = async (id) => request(`/person/${id}`, { append_to_response: 'combined_credits,images' });
export const search = (q, page = 1) => request('/search/multi', { query: q, page, include_adult: 'false' });
export const trending = (window) => request(`/trending/all/${window}`);
export const genres = () => request('/genre/movie/list');
export const discover = (params) => request('/discover/movie', params);
export const videos = (type, id) => request(`/${type}/${id}/videos`);
// Best YouTube clip for a title: official trailer, then any trailer, then a teaser.
export function pickTrailer(list = []) {
    const youtube = list.filter(v => v.site === 'YouTube');
    return youtube.find(v => v.type === 'Trailer' && v.official) || youtube.find(v => v.type === 'Trailer') || youtube.find(v => v.type === 'Teaser');
}
