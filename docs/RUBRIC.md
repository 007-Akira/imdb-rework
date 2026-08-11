# Project Evaluation Rubric Mapping

## 1. JavaScript Programming & Logic

- `lib/tmdb.ts`: modules, functions, objects, template literals, async catalogue requests, and conditional authentication.
- `components/Explore.tsx`: state variables, async functions, filters, spread syntax, and pagination.
- `components/WatchlistView.tsx`: copied arrays and `sort()` branches for recently added, rating, and year.
- `components/ClientActions.tsx`: `find()` selects a YouTube trailer; conditions select create/delete behavior.
- `components/Card.tsx`, `Carousel.tsx`, and `Grid.tsx`: `map()`, reusable functions, props, and conditional rendering.

## 2. DOM Manipulation & Events

React performs declarative DOM updates through state and reconciliation instead of manually calling `document.querySelector()`.

- `components/Navbar.tsx`: controlled `onChange`, validated `onSubmit`, debounced autocomplete, click navigation, loading, and errors.
- `components/ClientActions.tsx`: add/remove/rate/share clicks, rating input change and form submit, modal backdrop clicks, and Escape keyboard events.
- `components/WatchlistView.tsx`: remove clicks and sorting `onChange` dynamically update the rendered cards.
- `components/Explore.tsx`: filter change and Load More click update results without browser reload.
- `components/Carousel.tsx`: navigation buttons call `scrollBy()` for smooth dynamic movement.

## 3. MongoDB & CRUD

- Connection: `lib/mongodb.ts` caches the official `MongoClient` for development and serverless reuse.
- Database and collection constants: `lib/constants.ts` (`imdb_reimagined`, `watchlist`, `ratings`, `demo-user`).
- **CREATE:** `POST /api/watchlist` uses `insertOne`.
- **READ:** `GET /api/watchlist` uses `find`; `GET /api/ratings/[mediaType]/[tmdbId]` uses `findOne`.
- **UPDATE:** `PUT /api/ratings` uses `updateOne` with `upsert: true`.
- **DELETE:** `DELETE /api/watchlist/[id]` uses `deleteOne`.
- Unique compound indexes prevent duplicate watchlist and rating records for a user/title/media type.

## 4. Conceptual Clarity & Troubleshooting

1. Missing TMDB images are routed through `image()` in `lib/tmdb.ts` to `public/placeholder.svg`, preventing broken image elements.
2. Duplicate watchlist writes are prevented with a MongoDB unique compound index; duplicate-key errors return HTTP 409 instead of crashing.
3. Rating values are validated in the controlled React form and again in `lib/validation.ts` on the server; malformed values return HTTP 400.
4. Server-only `TMDB_API_KEY` and `MONGODB_URI` avoid exposing credentials. Missing MongoDB configuration returns a useful API error and leaves catalogue browsing intact.
5. Trailer selection gracefully reports “Trailer unavailable,” while modal Escape and backdrop handlers prevent trapped overlays.

## 5. Code Quality, Documentation & Individual Contribution

- `lib/` separates catalogue access, database access, constants, validation, types, and client API errors.
- `app/api/` contains focused REST-style route handlers with meaningful HTTP status codes.
- `components/` contains reusable Stitch-compatible interface components rather than duplicated pages.
- Strict TypeScript avoids `any`; names describe responsibilities and required features have no TODO placeholders.
- `README.md`, this rubric map, and `docs/DEMO.md` document setup, architecture, CRUD, and viva explanations.
