# Code examples for the article

These examples accompany **"How to Design Nested Documents for a Blogging App in MongoDB"**. Each file maps to a section of the article.

## Setup

- **MongoDB:** Local instance or Atlas. Set `MONGODB_URI` (default `mongodb://localhost:27017`) and optionally `MONGODB_DB` (default `blogging_app_examples`).
- **Node:** From the repo root, run scripts with `node examples/<file>.js`.

## Files

| File | Article section | Runnable? |
|------|-----------------|------------|
| `01-entities.js` | What entities exist in a blogging application? | No (snippets) |
| `02-embed-vs-reference.js` | When should you embed documents? | Yes |
| `03-blog-post-structure.js` | How should a blog post document be structured? | Yes |
| `04-comments-embedded.js` | Should comments be embedded inside blog posts? | Yes |
| `05-comments-separate-collection.js` | Unbounded comments — Option 1 (separate collection) | Yes |
| `06-comments-hybrid.js` | Unbounded comments — Option 2 (hybrid) | Yes |
| `07-threaded-replies.js` | How do nested replies affect schema design? | Yes |
| `08-optimization.js` | How do you optimize nested documents for performance? | Yes |
| `09-common-mistakes.js` | What are common mistakes? | No (snippets) |
| `10-final-schema/` | Final recommended schema | Yes (schema.js creates indexes) |

## Seed data

1. Create indexes: `node examples/10-final-schema/schema.js`
2. Insert sample data: `node examples/seed.js`

This seeds `users`, `posts`, and `comments` in the same database so you can try the final schema and the API (if running the app).
