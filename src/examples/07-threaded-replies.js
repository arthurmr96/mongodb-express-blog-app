/**
 * Article section: "How do nested replies affect schema design?"
 * Code: examples/07-threaded-replies.js
 *
 * Use parentCommentId for threaded replies instead of recursive embedding.
 * Avoids deeply nested arrays and keeps documents small.
 */

const { ObjectId } = require('mongodb');
const { getDb, close } = require('./lib/db');

async function run() {
  const db = await getDb();
  const commentsColl = db.collection('threaded_comments');

  await commentsColl.deleteMany({});

  const postId = new ObjectId();
  const comment1Id = new ObjectId();
  const comment2Id = new ObjectId();

  await commentsColl.insertMany([
    {
      _id: comment1Id,
      postId,
      parentCommentId: null,
      authorDisplayName: 'Alice',
      text: 'First comment',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: comment2Id,
      postId,
      parentCommentId: comment1Id,
      authorDisplayName: 'Bob',
      text: 'Reply to Alice',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId(),
      postId,
      parentCommentId: comment1Id,
      authorDisplayName: 'Charlie',
      text: 'Another reply to Alice',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  await commentsColl.createIndex({ postId: 1, createdAt: 1 });
  await commentsColl.createIndex({ parentCommentId: 1 });

  const topLevel = await commentsColl.find({ postId, parentCommentId: null }).sort({ createdAt: 1 }).toArray();
  const repliesToFirst = await commentsColl.find({ parentCommentId: comment1Id }).toArray();

  console.log('Top-level comments:', topLevel.length);
  console.log('Replies to first comment:', repliesToFirst.length);

  await close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
