/**
 * Seed sample data for the final schema (posts, users, comments).
 * Run after creating indexes: node examples/10-final-schema/schema.js
 * Then: node examples/seed.js
 *
 * Uses MONGODB_URI and MONGODB_DB (default: blogging_app_examples).
 */

const { ObjectId } = require('mongodb');
const { getDb, close } = require('./lib/db');

async function run() {
  const db = await getDb();
  const usersColl = db.collection('users');
  const postsColl = db.collection('posts');
  const commentsColl = db.collection('comments');

  await usersColl.deleteMany({});
  await postsColl.deleteMany({});
  await commentsColl.deleteMany({});

  const now = new Date();
  const user1 = {
    _id: new ObjectId(),
    username: 'jane_doe',
    email: 'jane@example.com',
    displayName: 'Jane Doe',
    slug: 'jane-doe',
    createdAt: now,
    updatedAt: now,
  };
  const user2 = {
    _id: new ObjectId(),
    username: 'bob_dev',
    email: 'bob@example.com',
    displayName: 'Bob Dev',
    slug: 'bob-dev',
    createdAt: now,
    updatedAt: now,
  };
  await usersColl.insertMany([user1, user2]);

  const post1 = {
    _id: new ObjectId(),
    title: 'Getting Started with MongoDB',
    slug: 'getting-started-mongodb',
    content: 'MongoDB is a document database...',
    author: { _id: user1._id, displayName: user1.displayName, slug: user1.slug },
    tags: ['mongodb', 'intro'],
    createdAt: now,
    updatedAt: now,
  };
  const post2 = {
    _id: new ObjectId(),
    title: 'Schema Design Tips',
    slug: 'schema-design-tips',
    content: 'Design for access patterns...',
    author: { _id: user1._id, displayName: user1.displayName, slug: user1.slug },
    tags: ['schema', 'best-practices'],
    createdAt: now,
    updatedAt: now,
  };
  await postsColl.insertMany([post1, post2]);

  const c1 = new ObjectId();
  await commentsColl.insertMany([
    {
      _id: c1,
      postId: post1._id,
      authorId: user2._id,
      authorDisplayName: user2.displayName,
      parentCommentId: null,
      text: 'Great post!',
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: new ObjectId(),
      postId: post1._id,
      authorId: user1._id,
      authorDisplayName: user1.displayName,
      parentCommentId: c1,
      text: 'Thanks!',
      createdAt: now,
      updatedAt: now,
    },
  ]);

  console.log('Seed done: 2 users, 2 posts, 2 comments.');
  await close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
