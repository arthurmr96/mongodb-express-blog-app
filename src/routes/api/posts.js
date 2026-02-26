const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../../db');

/**
 * @openapi
 * /api/posts:
 *   get:
 *     summary: List posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: skip
 *         schema: { type: integer, default: 0 }
 *     responses:
 *       200:
 *         description: List of posts (title, author, createdAt, tags; no full content by default)
 */
router.get('/', async (req, res, next) => {
  try {
    const db = await getDb();
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = parseInt(req.query.skip, 10) || 0;
    const posts = await db.collection('posts')
      .find({})
      .project({ title: 1, slug: 1, author: 1, tags: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     summary: Get a single post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Full post document (embedded author, tags, content)
 *       404:
 *         description: Post not found
 */
router.get('/:id', async (req, res, next) => {
  try {
    const db = await getDb();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const post = await db.collection('posts').findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/posts:
 *   post:
 *     summary: Create a post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, author]
 *             properties:
 *               title: { type: string }
 *               slug: { type: string }
 *               content: { type: string }
 *               author: { type: object, properties: { _id: {}, displayName: {}, slug: {} } }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Created post
 */
router.post('/', async (req, res, next) => {
  try {
    const db = await getDb();
    const now = new Date();
    const doc = {
      _id: new ObjectId(),
      title: req.body.title,
      content: req.body.content || '',
      slug: req.body.slug || req.body.title.toLowerCase().replace(/\s+/g, '-'),
      author: req.body.author || {},
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      createdAt: now,
      updatedAt: now,
    };
    await db.collection('posts').insertOne(doc);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
