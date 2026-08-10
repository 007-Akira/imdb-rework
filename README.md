# IMDb UI Redesign

A polished, responsive movie database demonstration built from the supplied Stitch visual language. It uses live TMDB data for movies, TV shows, people, search, discovery, credits, recommendations and trailers. Watchlists and ratings persist locally in the browser.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS, TMDB API and `next/image`.

## Setup

1. Create a TMDB account and copy your API Read Access Token.
2. Copy `.env.example` to `.env.local` and set `TMDB_API_KEY`.
3. Run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm start
```

For Vercel, import the repository and add `TMDB_API_KEY` in Project Settings → Environment Variables before deploying.

This is an independent UI redesign project created for demonstration/educational purposes and is not affiliated with IMDb. Movie metadata and imagery are supplied by TMDB.
