export const FEATURED_MOVIES = [
    { id: 634649, media_type: 'movie', title: 'Spider-Man: No Way Home', overview: 'Peter Parker seeks Doctor Strange’s help after his identity is revealed, but a dangerous spell tears open the multiverse.', poster_path: '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', backdrop_path: '/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg', release_date: '2021-12-15', vote_average: 7.9 },
    { id: 1368337, media_type: 'movie', title: 'The Odyssey', overview: 'Odysseus, the legendary King of Ithaca, embarks on a perilous journey home after the Trojan War, confronting gods, monsters and impossible trials.', poster_path: '/5rhTDKUhPYvpdQIijFIs5VoWsON.jpg', backdrop_path: '/r57L2UBLPKcHdZQYg8tagv9XqK2.jpg', release_date: '2026-07-15', vote_average: 5.8 },
];
export const BACKGROUND_VIDEOS = {
    969681: '8TZMtslA3UY',
    634649: 'ZYzbalQ6Lg8',
    1368337: 'vyCVVjA28fo',
};
export function featuredDetails(id) { const movie = FEATURED_MOVIES.find(item => item.id === id); return movie ? { ...movie, genres: id === 634649 ? [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Science Fiction' }] : [{ id: 12, name: 'Adventure' }, { id: 28, name: 'Action' }, { id: 14, name: 'Fantasy' }], credits: { cast: [], crew: [] }, videos: { results: [] }, recommendations: { page: 1, results: [], total_pages: 0, total_results: 0 } } : undefined; }
