/**
 * Article section: "How do you optimize nested documents for performance?"
 * Code: examples/08-optimization.js
 *
 * Indexing, projections to limit returned fields, pagination for comments.
 */

const { ObjectId } = require('mongodb');
const { getDb, close } = require('./lib/db');

async function run() {
  const db = await getDb();
  const postsColl = db.collection('optimization_posts');
  const commentsColl = db.collection('optimization_comments');

  await postsColl.deleteMany({});
  await commentsColl.deleteMany({});

  const postId = new ObjectId();
  await postsColl.insertOne({
    _id: postId,
    title: 'Optimization Example',
    content: 'Long content...',
    author: { _id: new ObjectId(), displayName: 'Jane', slug: 'jane' },
    tags: ['perf'],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await postsColl.createIndex({ createdAt: -1 });
  await postsColl.createIndex({ 'author.slug': 1 });
  await commentsColl.createIndex({ postId: 1, createdAt: -1 });

  // Projection: return only needed fields (e.g. list view without full content)
  const listView = await postsColl
    .find({})
    .project({ title: 1, 'author.displayName': 1, createdAt: 1, tags: 1 })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();
  console.log('List view (projection):', listView);

  // Pagination for comments
  const commentsPage = await commentsColl
    .find({ postId })
    .sort({ createdAt: -1 })
    .skip(0)
    .limit(20)
    .project({ text: 1, authorDisplayName: 1, createdAt: 1 })
    .toArray();
  console.log('Comments page (paginated + projected):', commentsPage.length);

  await close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
