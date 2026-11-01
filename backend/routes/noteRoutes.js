const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/Note');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
router.use(auth); // every note route requires login

const CATEGORIES = ['College', 'Personal', 'Work', 'Project', 'Important', 'Other'];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Accepts "a, b, c" or ["a","b"] and returns a clean unique array
function cleanTags(tags) {
  const list = Array.isArray(tags) ? tags : String(tags || '').split(',');
  return [...new Set(list.map((t) => String(t).trim()).filter(Boolean))].slice(0, 10);
}

// Validates body and returns { error } or { data }
function validateNote(body) {
  const title = String(body.title || '').trim();
  if (!title) return { error: 'Title is required' };
  if (title.length > 120) return { error: 'Title must be 120 characters or less' };

  const category = body.category || 'Other';
  if (!CATEGORIES.includes(category)) return { error: 'Invalid category' };

  return {
    data: {
      title,
      content: String(body.content || ''),
      category,
      tags: cleanTags(body.tags),
      important: body.important === true || body.important === 'true'
    }
  };
}

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/notes?q=&category=&important=true&limit=
router.get('/', async (req, res, next) => {
  try {
    const filter = { userId: req.userId };
    const { q, category, important, limit } = req.query;

    if (category && CATEGORIES.includes(category)) filter.category = category;
    if (important === 'true') filter.important = true;

    if (q && q.trim()) {
      const rx = new RegExp(escapeRegex(q.trim()), 'i');
      filter.$or = [{ title: rx }, { content: rx }, { category: rx }, { tags: rx }];
    }

    let query = Note.find(filter).sort({ important: -1, updatedAt: -1 });
    if (limit) query = query.limit(Math.min(parseInt(limit, 10) || 20, 100));

    res.json(await query);
  } catch (err) {
    next(err);
  }
});

// POST /api/notes
router.post('/', async (req, res, next) => {
  try {
    const { error, data } = validateNote(req.body);
    if (error) return res.status(400).json({ message: error });

    const note = await Note.create({ ...data, userId: req.userId });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

// GET /api/notes/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid note id' });
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// PUT /api/notes/:id
router.put('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid note id' });
    const { error, data } = validateNote(req.body);
    if (error) return res.status(400).json({ message: error });

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      data,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid note id' });
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
