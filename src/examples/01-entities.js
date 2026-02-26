/**
 * Article section: "What entities exist in a blogging application?"
 * Code: examples/01-entities.js
 *
 * Before designing nested documents, identify core entities.
 * In MongoDB, access patterns matter more than normalization.
 */

// --- Users (authors and readers) ---
const userEntity = {
  _id: undefined, // ObjectId
  username: 'jane_doe',
  email: 'jane@example.com',
  displayName: 'Jane Doe',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// --- Blog posts ---
const postEntity = {
  _id: undefined,
  title: 'My First Post',
  slug: 'my-first-post',
  content: '...',
  authorId: undefined, // or embedded author snapshot
  tags: ['mongodb', 'blogging'],
  status: 'published',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// --- Comments ---
const commentEntity = {
  _id: undefined,
  postId: undefined,
  authorId: undefined,
  parentCommentId: null, // for threaded replies
  text: 'Great post!',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// --- Categories or tags (often embedded in post or separate collection) ---
const tagEntity = {
  _id: undefined,
  name: 'mongodb',
  slug: 'mongodb',
};

// --- Reactions (likes, shares) - can be embedded or separate ---
const reactionEntity = {
  _id: undefined,
  targetType: 'post', // or 'comment'
  targetId: undefined,
  userId: undefined,
  type: 'like', // or 'share'
  createdAt: new Date(),
};

// Why access patterns matter: we model based on how we read/write data.
// Example: if we always load "post + author name", embedding a small author
// snapshot in the post avoids a second query. If we rarely need author with
// the post, referencing (authorId) may be better.

module.exports = {
  userEntity,
  postEntity,
  commentEntity,
  tagEntity,
  reactionEntity,
};
