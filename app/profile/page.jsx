import Link from 'next/link';
import { redirect } from 'next/navigation';
import Grid from '@/components/Grid';
import ProfileHeader from '@/components/ProfileHeader';
import { getCurrentUser } from '@/lib/auth';
import { RATINGS_COLLECTION, WATCHLIST_COLLECTION } from '@/lib/constants';
import { getDatabase } from '@/lib/mongodb';
import { details, title } from '@/lib/tmdb';
export const metadata = { title: 'My Profile' };
// Converts a stored watchlist/rating document into the TMDB-shaped object that Card expects.
const toCardItem = (doc, extra = {}) => ({ id: doc.tmdbId, media_type: doc.mediaType, title: doc.title || 'Untitled', poster_path: doc.posterPath, release_date: doc.releaseDate, vote_average: doc.tmdbRating, ...extra });
// Ratings saved before titles were stored only have a TMDB ID, so look those up once here.
async function withTitle(rating) {
    if (rating.title)
        return rating;
    try {
        const d = await details(rating.mediaType, rating.tmdbId);
        return { ...rating, title: title(d), posterPath: d.poster_path, releaseDate: d.release_date || d.first_air_date };
    }
    catch {
        return rating;
    }
}
function Section({ heading, action, empty, items }) {
    return <section className="mt-16"><div className="mb-6 flex items-end justify-between gap-4"><h2 className="text-2xl font-bold md:text-3xl">{heading}</h2>{action}</div>{items.length ? <Grid items={items} preloadCount={0}/> : <p className="rounded-2xl bg-surface p-10 text-center text-muted">{empty}</p>}</section>;
}
export default async function Page() {
    const user = await getCurrentUser().catch(() => null);
    if (!user)
        redirect('/login?next=/profile');
    const db = await getDatabase();
    const [watchlist, rawRatings] = await Promise.all([
        db.collection(WATCHLIST_COLLECTION).find({ userId: user.id }).sort({ addedAt: -1 }).toArray(),
        db.collection(RATINGS_COLLECTION).find({ userId: user.id }).sort({ updatedAt: -1 }).toArray(),
    ]);
    const ratings = await Promise.all(rawRatings.map(withTitle));
    const average = ratings.length ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
    const stats = [['In watchlist', watchlist.length], ['Titles rated', ratings.length], ['Average rating', ratings.length ? average.toFixed(1) : '—']];
    return <main className="mx-auto min-h-screen max-w-screen px-5 pb-10 pt-32 md:px-16"><ProfileHeader initialUser={{ ...user, createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null }} stats={stats}/><Section heading="Your Watchlist" action={watchlist.length > 0 && <Link href="/watchlist" className="text-sm font-semibold text-gold hover:underline">Manage watchlist</Link>} empty="Nothing saved yet. Add movies and shows to your watchlist to see them here." items={watchlist.map(doc => toCardItem(doc))}/><Section heading="Your Ratings" empty="You haven't rated anything yet. Open a movie or show and choose Rate." items={ratings.map(doc => toCardItem(doc, { score: doc.rating }))}/></main>;
}
