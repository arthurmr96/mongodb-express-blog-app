/**
 * Article section: "How do you handle unbounded comment growth? — Option 1"
 * Code: examples/05-comments-separate-collection.js
 *
 * Store comments in a separate collection; reference by postId. Index by
 * postId and createdAt for efficient pagination.
 */

const { ObjectId } = require('mongodb');
const { getDb, close } = require('./lib/db');

async function run() {
  const db = await getDb();
  const postsColl = db.collection('comments_separate_posts');
  const commentsColl = db.collection('comments_separate_comments');

  await postsColl.deleteMany({});
  await commentsColl.deleteMany({});

  const postId = new ObjectId();
  await postsColl.insertOne({
    _id: postId,
    title: 'Post with Separate Comments',
    content: '...',
    author: { _id: new ObjectId(), displayName: 'Jane', slug: 'jane' },
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  for (let i = 0; i < 5; i++) {
    await commentsColl.insertOne({
      _id: new ObjectId(),
      postId,
      authorId: new ObjectId(),
      authorDisplayName: `User${i}`,
      text: `Comment ${i + 1}`,
      createdAt: new Date(Date.now() - (4 - i) * 60000),
      updatedAt: new Date(),
    });
  }

  // Index for efficient "comments for post" + sort by date (pagination)
  await commentsColl.createIndex({ postId: 1, createdAt: -1 });

  const pageSize = 2;
  const page = 1;
  const skip = (page - 1) * pageSize;

  const comments = await commentsColl
    .find({ postId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();

  console.log('Paginated comments (page 1, size 2):', JSON.stringify(comments, null, 2));

  await close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
