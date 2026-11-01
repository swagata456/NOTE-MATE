const express = require('express');
const mongoose = require('mongoose');
const Reminder = require('../models/Reminder');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
router.use(auth); // every reminder route requires login

const PRIORITIES = ['Low', 'Medium', 'High'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const validId = (id) => mongoose.Types.ObjectId.isValid(id);

function validateReminder(body) {
  const title = String(body.title || '').trim();
  if (!title) return { error: 'Reminder title is required' };
  if (title.length > 120) return { error: 'Title must be 120 characters or less' };
  if (!DATE_RE.test(body.date || '')) return { error: 'A valid date is required' };
  if (!TIME_RE.test(body.time || '')) return { error: 'A valid time is required' };

  const priority = body.priority || 'Medium';
  if (!PRIORITIES.includes(priority)) return { error: 'Invalid priority' };

  return {
    data: {
      title,
      description: String(body.description || ''),
      date: body.date,
      time: body.time,
      priority
    }
  };
}

// GET /api/reminders?q=&priority=&status=pending|completed&when=today|upcoming&today=YYYY-MM-DD
// "today" comes from the browser so it uses the user's local date.
router.get('/', async (req, res, next) => {
  try {
    const filter = { userId: req.userId };
    const { q, priority, status, when, today, limit } = req.query;

    if (priority && PRIORITIES.includes(priority)) filter.priority = priority;
    if (status === 'completed') filter.completed = true;
    if (status === 'pending') filter.completed = false;

    if (DATE_RE.test(today || '')) {
      if (when === 'today') filter.date = today;
      if (when === 'upcoming') {
        filter.date = { $gte: today };
        filter.completed = false;
      }
    }

    if (q && q.trim()) {
      const rx = new RegExp(escapeRegex(q.trim()), 'i');
      filter.$or = [{ title: rx }, { description: rx }];
    }

    let query = Reminder.find(filter).sort({ date: 1, time: 1 });
    if (limit) query = query.limit(Math.min(parseInt(limit, 10) || 20, 100));

    res.json(await query);
  } catch (err) {
    next(err);
  }
});

// POST /api/reminders
router.post('/', async (req, res, next) => {
  try {
    const { error, data } = validateReminder(req.body);
    if (error) return res.status(400).json({ message: error });

    const reminder = await Reminder.create({ ...data, userId: req.userId });
    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
});

// GET /api/reminders/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid reminder id' });
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.userId });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json(reminder);
  } catch (err) {
    next(err);
  }
});

// PUT /api/reminders/:id
// Two uses:
//  1) Full edit (title/date/time/...). Resets notificationSent so the new time can notify.
//  2) Partial update with only { completed } and/or { notificationSent }.
router.put('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid reminder id' });

    const update = {};
    const isFullEdit = req.body.title !== undefined;

    if (isFullEdit) {
      const { error, data } = validateReminder(req.body);
      if (error) return res.status(400).json({ message: error });
      Object.assign(update, data, { notificationSent: false });
    }
    if (typeof req.body.completed === 'boolean') update.completed = req.body.completed;
    if (!isFullEdit && typeof req.body.notificationSent === 'boolean') {
      update.notificationSent = req.body.notificationSent;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      update,
      { new: true }
    );
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json(reminder);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/reminders/:id
router.delete('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid reminder id' });
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
