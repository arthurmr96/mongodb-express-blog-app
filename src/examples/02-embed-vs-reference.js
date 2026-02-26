/**
 * Article section: "When should you embed documents in MongoDB?"
 * Code: examples/02-embed-vs-reference.js
 *
 * Embed: data accessed together, one-to-few, small and bounded.
 * Reference: data grows unbounded or has independent lifecycle.
 */

const { ObjectId } = require('mongodb');
const { getDb, close } = require('./lib/db');

async function run() {
  const db = await getDb();

  // --- Embedded: author snapshot inside post (read together, small, bounded) ---
  const postWithEmbeddedAuthor = {
    _id: new ObjectId(),
    title: 'Embedding Example',
    content: 'When author is small and always read with the post.',
    author: {
      _id: new ObjectId(),
      displayName: 'Jane Doe',
      slug: 'jane-doe',
    },
    tags: ['embedding'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // --- Referenced: post only stores authorId (author in separate collection) ---
  const authorId = new ObjectId();
  const postWithReference = {
    _id: new ObjectId(),
    title: 'Reference Example',
    content: 'When author is large or updated independently.',
    authorId,
    tags: ['referencing'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const postsColl = db.collection('embed_vs_ref_posts');
  const usersColl = db.collection('embed_vs_ref_users');

  await postsColl.deleteMany({});
  await usersColl.deleteMany({});

  await postsColl.insertOne(postWithEmbeddedAuthor);
  await postsColl.insertOne(postWithReference);
  await usersColl.insertOne({
    _id: authorId,
    displayName: 'Jane Doe',
    bio: 'Long bio...',
    updatedAt: new Date(),
  });

  // Find post with embedded author (single read)
  const withEmbedded = await postsColl.findOne({ _id: postWithEmbeddedAuthor._id });
  console.log('Post with embedded author:', JSON.stringify(withEmbedded, null, 2));

  // Find post with reference (need second query for author if needed)
  const withRef = await postsColl.findOne({ _id: postWithReference._id });
  const author = await usersColl.findOne({ _id: withRef.authorId });
  console.log('Post with reference + author:', { post: withRef.title, author: author?.displayName });

  await close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
