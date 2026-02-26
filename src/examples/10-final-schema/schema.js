/**
 * Article section: "Putting it all together — Final recommended schema"
 * Code: examples/10-final-schema/schema.js
 *
 * Production-ready: posts, users, comments collections and indexing strategy.
 */

const { ObjectId } = require('mongodb');
const { getDb, close } = require('../lib/db');

async function createIndexes(db) {
  const posts = db.collection('posts');
  const users = db.collection('users');
  const comments = db.collection('comments');

  await posts.createIndex({ createdAt: -1 });
  await posts.createIndex({ 'author.slug': 1 });
  await posts.createIndex({ tags: 1 });

  await users.createIndex({ slug: 1 }, { unique: true });
  await users.createIndex({ email: 1 }, { unique: true });

  await comments.createIndex({ postId: 1, createdAt: -1 });
  await comments.createIndex({ parentCommentId: 1 });
}

async function run() {
  const db = await getDb();
  await createIndexes(db);
  console.log('Final schema indexes created on posts, users, comments.');
  await close();
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { createIndexes };
