/**
 * Article section: "How do you handle unbounded comment growth? — Option 2"
 * Code: examples/06-comments-hybrid.js
 *
 * Hybrid: embed only recent comments in the post; older comments in a
 * separate collection. Keeps post reads fast while scaling.
 */

const { ObjectId } = require('mongodb');
const { getDb, close } = require('./lib/db');

const RECENT_COMMENTS_LIMIT = 3;

async function run() {
  const db = await getDb();
  const postsColl = db.collection('hybrid_posts');
  const commentsColl = db.collection('hybrid_comments');

  await postsColl.deleteMany({});
  await commentsColl.deleteMany({});

  const postId = new ObjectId();
  await postsColl.insertOne({
    _id: postId,
    title: 'Post with Hybrid Comments',
    content: '...',
    author: { _id: new ObjectId(), displayName: 'Jane', slug: 'jane' },
    tags: [],
    recentComments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Simulate: 5 comments total; keep last 3 embedded
  const allComments = [];
  for (let i = 0; i < 5; i++) {
    const c = {
      _id: new ObjectId(),
      postId,
      authorDisplayName: `User${i}`,
      text: `Comment ${i + 1}`,
      createdAt: new Date(Date.now() - (4 - i) * 60000),
    };
    allComments.push(c);
    await commentsColl.insertOne({ ...c, updatedAt: new Date() });
  }

  const recent = allComments.slice(-RECENT_COMMENTS_LIMIT).reverse();
  await postsColl.updateOne(
    { _id: postId },
    { $set: { recentComments: recent, updatedAt: new Date() } }
  );

  const post = await postsColl.findOne({ _id: postId });
  console.log('Post with recentComments (embedded):', post.recentComments);

  const olderComments = await commentsColl
    .find({ postId, createdAt: { $lt: recent[recent.length - 1].createdAt } })
    .sort({ createdAt: -1 })
    .toArray();
  console.log('Older comments (from collection):', olderComments.length);

  await close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
