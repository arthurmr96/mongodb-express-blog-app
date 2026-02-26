const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../../db');

/**
 * @openapi
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: List comments for a post (paginated)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: skip
 *         schema: { type: integer, default: 0 }
 *     responses:
 *       200:
 *         description: List of comments (postId, authorDisplayName, text, parentCommentId, createdAt)
 */
router.get('/posts/:postId/comments', async (req, res, next) => {
  try {
    const db = await getDb();
    const postId = req.params.postId;
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid postId' });
    }
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = parseInt(req.query.skip, 10) || 0;
    const comments = await db.collection('comments')
      .find({ postId: new ObjectId(postId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text, authorId, authorDisplayName]
 *             properties:
 *               text: { type: string }
 *               authorId: {}
 *               authorDisplayName: { type: string }
 *               parentCommentId: { type: string, nullable: true }
 *     responses:
 *       201:
 *         description: Created comment
 */
router.post('/posts/:postId/comments', async (req, res, next) => {
  try {
    const db = await getDb();
    const postId = req.params.postId;
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid postId' });
    }
    const now = new Date();
    const doc = {
      _id: new ObjectId(),
      postId: new ObjectId(postId),
      authorId: req.body.authorId ? new ObjectId(req.body.authorId) : new ObjectId(),
      authorDisplayName: req.body.authorDisplayName || 'Anonymous',
      parentCommentId: req.body.parentCommentId && ObjectId.isValid(req.body.parentCommentId)
        ? new ObjectId(req.body.parentCommentId)
        : null,
      text: req.body.text || '',
      createdAt: now,
      updatedAt: now,
    };
    await db.collection('comments').insertOne(doc);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
