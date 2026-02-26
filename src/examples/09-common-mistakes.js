/**
 * Article section: "What are common mistakes when designing nested schemas?"
 * Code: examples/09-common-mistakes.js
 *
 * Snippets only — what NOT to do. No connection required.
 */

// --- Mistake 1: Over-embedding everything ---
// BAD: embedding full user profile and all comments in every post
const overEmbeddedPost = {
  _id: 1,
  title: '...',
  author: { _id: 1, name: '...', email: '...', bio: '...', avatarUrl: '...', preferences: {} },
  comments: [
    { _id: 1, author: { fullProfile: '...' }, text: '...', replies: [/* unbounded */] },
    // ... thousands of comments
  ],
};

// --- Mistake 2: Ignoring document size limit ---
// BAD: comments array with no bound — can exceed 16MB
const unboundedComments = {
  _id: 1,
  title: '...',
  comments: [], // grows forever
};

// --- Mistake 3: Forgetting index strategy ---
// BAD: querying by createdAt or postId without index
// db.posts.find({ createdAt: { $gte: start } })  // full collection scan if no index
// db.comments.find({ postId: id })              // full collection scan if no index on postId

// --- Mistake 4: Modeling based on relational habits ---
// BAD: normalizing like SQL — many small collections with joins done in app
// (In MongoDB, prefer embedding when data is read together and bounded.)

// --- Mistake 5: Not planning for comment growth ---
// BAD: embedding all comments in post from day one
const postWithAllCommentsEmbedded = {
  _id: 1,
  comments: [/* will grow to 10k+ */],
};

// --- Mistake 6: Updating large documents too frequently ---
// BAD: $push to a huge comments array on every new comment → full document rewrite each time
// db.posts.updateOne({ _id }, { $push: { comments: newComment } });  // expensive when comments is huge

module.exports = {
  overEmbeddedPost,
  unboundedComments,
  postWithAllCommentsEmbedded,
};
