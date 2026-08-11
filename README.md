# IMDb Reimagined

## Overview

IMDb Reimagined is an independent, responsive movie-database UI redesign built for demonstration and education. It preserves the supplied dark Stitch visual language while connecting real catalogue data and persistent user interactions. It is not affiliated with IMDb.

## Features

- Live TMDB movie, TV, person, cast, recommendation, and image data
- Dynamic multi-type search with debounced autocomplete
- Movie and TV details with responsive YouTube trailer playback
- Movie discovery, genres, ratings, sorting, pagination, and trending views
- MongoDB-backed watchlist with duplicate prevention and sorting
- MongoDB-backed 1–10 user ratings with persistent updates
- Responsive navigation, grids, carousels, loading states, and error feedback

## Technology Stack

- Next.js 15 App Router
- React 19 and TypeScript
- Tailwind CSS
- TMDB API
- MongoDB Atlas using the official `mongodb` package
- Lucide React icons and `next/image`

## Architecture

- **TMDB** is the public catalogue source for movies, TV shows, people, credits, videos, recommendations, and images.
- **MongoDB** stores application-generated state only: the demo user's watchlist and ratings.
- **React** provides declarative DOM updates through state, conditional rendering, forms, and event handlers.
- **Next.js route handlers** form the server/API layer, validate input, call MongoDB, and keep credentials server-side.

## MongoDB Collections

Database: `imdb_reimagined`. The fixed evaluation user is `demo-user`; authentication is intentionally out of scope.

### `watchlist`

```json
{
  "userId": "demo-user",
  "tmdbId": 634649,
  "mediaType": "movie",
  "title": "Spider-Man: No Way Home",
  "posterPath": "/poster.jpg",
  "tmdbRating": 7.9,
  "releaseDate": "2021-12-15",
  "overview": "...",
  "addedAt": "Date"
}
```

A unique compound index on `userId + tmdbId + mediaType` prevents duplicate records.

### `ratings`

```json
{
  "userId": "demo-user",
  "tmdbId": 634649,
  "mediaType": "movie",
  "rating": 9,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Ratings are validated from 1–10 and updated using a MongoDB upsert.

## CRUD Mapping

- **CREATE:** Add a movie or TV show to the watchlist (`insertOne`).
- **READ:** Open My Watchlist or load a saved rating (`find`, `findOne`).
- **UPDATE:** Save or change a rating (`updateOne` with `upsert`).
- **DELETE:** Remove a watchlist record (`deleteOne`).

## JavaScript Concepts Demonstrated

The application uses modules, `const`/`let`, typed objects, arrays, arrow and named functions, destructuring, spread syntax, template literals, `map`, `filter`, `find`, `sort`, conditions, `async`/`await`, promises, and `try`/`catch`. React handlers cover `onClick`, `onChange`, `onSubmit`, keyboard Escape events, controlled form validation, modal state, autocomplete, filtering, sorting, and carousel movement.

## Setup

1. Create a TMDB credential and MongoDB Atlas database.
2. Copy `.env.example` to `.env.local`.
3. Configure:

```env
TMDB_API_KEY=your_tmdb_api_key_or_read_token
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/?retryWrites=true&w=majority
```

4. Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run lint
npm run build
npm start
```

For Vercel, add both environment variables in Project Settings before deploying.

This product uses the TMDB API but is not endorsed or certified by TMDB. IMDb Reimagined is an independent redesign and educational demonstration, not an official IMDb product.
