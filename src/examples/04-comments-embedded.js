/**
 * Article section: "Should comments be embedded inside blog posts?"
 * Code: examples/04-comments-embedded.js
 *
 * Simple approach: comments as array inside post. Limitations: comments can
 * grow unbounded, MongoDB document size limit (16MB), large arrays hurt write
 * performance, and updating nested arrays rewrites the whole document.
 */

const { ObjectId } = require('mongodb');
const { getDb, close } = require('./lib/db');

async function run() {
  const db = await getDb();

  const postWithEmbeddedComments = {
    _id: new ObjectId(),
    title: 'Post with Embedded Comments',
    content: '...',
    author: { _id: new ObjectId(), displayName: 'Jane', slug: 'jane' },
    tags: ['example'],
    comments: [
      { _id: new ObjectId(), author: 'Alice', text: 'Nice!', createdAt: new Date() },
      { _id: new ObjectId(), author: 'Bob', text: 'Thanks.', createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const coll = db.collection('posts_with_comments_embedded');
  await coll.deleteMany({});
  await coll.insertOne(postWithEmbeddedComments);

  const found = await coll.findOne({ _id: postWithEmbeddedComments._id });
  console.log('Post with embedded comments:', JSON.stringify(found, null, 2));

  // Limitation: adding a comment rewrites the whole document.
  await coll.updateOne(
    { _id: postWithEmbeddedComments._id },
    {
      $push: {
        comments: {
          _id: new ObjectId(),
          author: 'Charlie',
          text: 'Third comment.',
          createdAt: new Date(),
        },
      },
      $set: { updatedAt: new Date() },
    }
  );

  // When comments grow unbounded: document size can approach 16MB,
  // and every push causes a full document rewrite. Prefer separate
  // comments collection for scalability (see 05-comments-separate-collection.js).

  await close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
