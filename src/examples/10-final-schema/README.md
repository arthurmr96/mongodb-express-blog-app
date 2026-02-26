# Final recommended schema

This folder defines the production-ready structure for the blogging app described in the article.

## Collections

- **posts**  
  - `_id`, `title`, `content`, `slug`, `author` (embedded snapshot: `_id`, `displayName`, `slug`), `tags` (array), `createdAt`, `updatedAt`.  
  - Author is embedded because it is small and read with every post.

- **users**  
  - `_id`, `username`, `email`, `displayName`, `slug`, `createdAt`, `updatedAt`.  
  - Referenced by `author._id` in posts; full profile lives here.

- **comments**  
  - `_id`, `postId`, `authorId`, `authorDisplayName`, `parentCommentId` (null for top-level), `text`, `createdAt`, `updatedAt`.  
  - Stored in a separate collection so comment count can grow without hitting the 16MB document limit. Threaded replies use `parentCommentId`.

## Indexes

- **posts:** `createdAt` desc (list by date), `author.slug`, `tags`.
- **users:** `slug` unique, `email` unique.
- **comments:** `(postId, createdAt)` desc (paginated comments per post), `parentCommentId` (replies).

## How they interact

1. Create/update a post with an embedded author snapshot (from the current user document).
2. Create a comment in the `comments` collection with `postId` and optional `parentCommentId`.
3. List posts with a projection if you don’t need full content; list comments for a post with pagination using the `(postId, createdAt)` index.

Run `node examples/10-final-schema/schema.js` (from repo root) to create the indexes. Use `examples/seed.js` to insert sample data.
