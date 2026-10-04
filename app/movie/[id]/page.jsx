import { notFound } from 'next/navigation';
import DetailsPage from '@/components/DetailsPage';
import { featuredDetails } from '@/lib/featured';
import { details, title } from '@/lib/tmdb';
export async function generateMetadata({ params }) {
    const id = (await params).id;
    try {
        const movie = await details('movie', id);
        return { title: title(movie) };
    }
    catch {
        return { title: title(featuredDetails(Number(id)) || { id: Number(id), title: 'Movie' }) };
    }
}
export default async function Page({ params }) {
    const id = (await params).id;
    try {
        return <DetailsPage item={await details('movie', id)} type="movie"/>;
    }
    catch {
        const fallback = featuredDetails(Number(id));
        if (fallback)
            return <DetailsPage item={fallback} type="movie"/>;
        notFound();
    }
}
