# Live Evaluation Demo

## Demonstration sequence

1. Open the homepage and identify the live TMDB catalogue.
2. Click **Sign in**, choose **Create an account**, and register (MongoDB **CREATE** on `users`). Explain password hashing and the httpOnly session cookie.
3. Search for **Batman** in the navbar.
4. Explain `onChange`, the two-character debounce, dynamic results, and form validation.
5. Open **The Batman** and show API-driven poster, backdrop, details, cast, director, and recommendations.
6. Open and close the trailer with the button, backdrop, and Escape key.
7. Add the movie to Watchlist: MongoDB **CREATE** (`insertOne`).
8. Open My Watchlist: MongoDB **READ** (`find`).
9. Refresh to prove database persistence.
10. Rate the movie and save: MongoDB **UPDATE** (`updateOne` with upsert).
11. Change the rating and refresh to prove the updated value persists.
12. Sort the watchlist by Recently Added, Highest Rating, and Release Year.
13. Remove the movie: MongoDB **DELETE** (`deleteOne`).
14. Refresh to prove deletion persists.
15. Open Explore Movies, change a filter, and use Load More.
16. Briefly resize to mobile width and show responsive navigation and horizontal carousels.

## Questions the evaluator may ask

**Why MongoDB?** It naturally stores watchlist and rating documents, supports indexes and upserts, and works well with serverless Next.js handlers.

**What is a document?** One BSON record containing fields, such as one saved watchlist movie.

**What is a collection?** A group of related documents, comparable to a table but schema-flexible.

**What is CRUD?** Create, Read, Update, and Delete—the four basic persistent-data operations.

**Difference between TMDB and MongoDB here?** TMDB supplies the public entertainment catalogue; MongoDB stores this application's user accounts, sessions, and each user's watchlist and ratings.

**How are passwords stored?** Never in plain text: each is hashed with `scrypt` and a random salt. Login re-hashes the attempt and compares with `timingSafeEqual`.

**How does the server know who is signed in?** Login sets a random token in an httpOnly cookie. The server hashes it and looks up the matching, unexpired document in `sessions`.

**How does React manipulate the DOM?** State changes cause React to reconcile a declarative component tree and update only the necessary DOM nodes.

**What is an event handler?** A function invoked by an interaction such as click, input change, submit, or keydown.

**Why use async/await?** It makes Promise-based network and database flows readable and allows straightforward `try/catch` errors.

**What does `map()` do?** It transforms every array element, such as turning movie objects into cards.

**Difference between `map()` and `filter()`?** `map()` transforms elements; `filter()` keeps only elements matching a condition.

**How are duplicate records prevented?** A unique MongoDB index combines `userId`, `tmdbId`, and `mediaType`; duplicate inserts return HTTP 409.

**What happens when MongoDB fails?** Route handlers catch the failure and return structured errors; the UI displays the message without crashing or losing TMDB browsing.

**What validation exists?** Search trims empty input and waits for two characters. Ratings must be numeric and 1–10 on client and server. API routes validate IDs, media type, titles, and JSON bodies.
