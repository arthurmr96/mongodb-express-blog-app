/**
 * Article section: "How should a blog post document be structured?"
 * Code: examples/03-blog-post-structure.js
 *
 * First version: _id, title, content, embedded author (small), tags array,
 * createdAt / updatedAt. Author embedded when small and read with post;
 * tags as array; timestamps for sorting and indexing.
 */

const { ObjectId } = require('mongodb');
const { getDb, close } = require('./lib/db');

async function run() {
  const db = await getDb();

  // Why embedded author: small, frequently read with the post; avoids extra query.
  // Why tags as array: bounded, filtered/sorted together, good for multikey index.
  // Why timestamps: sorting (newest first), range queries, TTL or archival.
  const post = {
    _id: new ObjectId(),
    title: 'How to Design Nested Documents',
    content: 'Designing nested documents correctly is critical...',
    author: {
      _id: new ObjectId(),
      displayName: 'Jane Doe',
      slug: 'jane-doe',
    },
    tags: ['mongodb', 'schema', 'blogging'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const coll = db.collection('posts_v1');
  await coll.deleteMany({});
  await coll.insertOne(post);

  const found = await coll.findOne({ _id: post._id });
  console.log('Inserted post:', JSON.stringify(found, null, 2));

  await close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
