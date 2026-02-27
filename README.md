# How to Design Nested Documents for a Blogging App in MongoDB

Code companion for the article **"How to Design Nested Documents for a Blogging App in MongoDB"** _(link coming soon)_.

Each example file maps directly to a section of the article and can be read alongside it. The repo also ships a small Express REST API that puts the final recommended schema into practice.

---

## Prerequisites

- Node.js 18+
- A MongoDB instance — local (`mongodb://localhost:27017`) or [Atlas](https://www.mongodb.com/atlas)
- pnpm (or npm/yarn)

---

## Setup

1. **Install dependencies** (from the repo root):

   ```bash
   pnpm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your connection string:

   | Variable | Default | Description |
   |---|---|---|
   | `MONGODB_URI` | `mongodb://localhost:27017` | MongoDB connection string |
   | `MONGODB_DB` | `blogging_app_examples` | Database name used by examples and API |
   | `PORT` | `3000` | Port for the Express server |

---

## Running the examples

All scripts are run from the **repo root**.

### Run a single example file

```bash
node src/examples/02-embed-vs-reference.js
```

Replace the filename with whichever example you want to explore. Files marked as _snippets_ below are not executable — they exist purely as annotated code for the article.

### Create indexes for the final schema

Must be run before seeding or using the API:

```bash
node src/examples/10-final-schema/schema.js
```

### Seed sample data

Populates `users`, `posts`, and `comments` collections so you can explore the final schema and hit the API with real data:

```bash
node src/examples/seed.js
```

---

## Running the API server

The Express app exposes a REST API backed by the final schema and includes Swagger docs.

**Development** (auto-restarts on file changes):

```bash
pnpm dev
```

**Production:**

```bash
pnpm start
```

Once running:

| Endpoint | Description |
|---|---|
| `GET /api/posts` | List posts |
| `GET /api/posts/:id` | Get a post |
| `POST /api/posts` | Create a post |
| `GET /api/users` | List users |
| `GET /api/users/:id` | Get a user |
| `GET /api/:postId/comments` | List comments for a post |
| `POST /api/:postId/comments` | Create a comment |
| `GET /api-docs` | Swagger UI |

---

## Example files

| File | Article section | Runnable |
|---|---|---|
| `01-entities.js` | What entities exist in a blogging application? | No (snippets) |
| `02-embed-vs-reference.js` | When should you embed documents? | Yes |
| `03-blog-post-structure.js` | How should a blog post document be structured? | Yes |
| `04-comments-embedded.js` | Should comments be embedded inside blog posts? | Yes |
| `05-comments-separate-collection.js` | Unbounded comments — Option 1: separate collection | Yes |
| `06-comments-hybrid.js` | Unbounded comments — Option 2: hybrid | Yes |
| `07-threaded-replies.js` | How do nested replies affect schema design? | Yes |
| `08-optimization.js` | How do you optimize nested documents for performance? | Yes |
| `09-common-mistakes.js` | What are common mistakes with nested documents? | No (snippets) |
| `10-final-schema/` | Final recommended schema + index setup | Yes |
| `seed.js` | Sample data for the final schema | Yes |
