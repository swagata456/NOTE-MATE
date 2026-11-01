const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/Note');
const Reminder = require('../models/Reminder');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
router.use(auth);

// GET /api/dashboard?today=YYYY-MM-DD
router.get('/', async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const today = /^\d{4}-\d{2}-\d{2}$/.test(req.query.today || '')
      ? req.query.today
      : new Date().toISOString().slice(0, 10);

    const [
      totalNotes,
      importantNotes,
      totalReminders,
      pendingReminders,
      completedReminders,
      todaysReminders,
      recentNotes,
      upcomingReminders
    ] = await Promise.all([
      Note.countDocuments({ userId }),
      Note.countDocuments({ userId, important: true }),
      Reminder.countDocuments({ userId }),
      Reminder.countDocuments({ userId, completed: false }),
      Reminder.countDocuments({ userId, completed: true }),
      Reminder.countDocuments({ userId, date: today }),
      Note.find({ userId }).sort({ updatedAt: -1 }).limit(4),
      Reminder.find({ userId, completed: false, date: { $gte: today } })
        .sort({ date: 1, time: 1 })
        .limit(5)
    ]);

    res.json({
      stats: {
        totalNotes,
        importantNotes,
        totalReminders,
        pendingReminders,
        completedReminders,
        todaysReminders
      },
      recentNotes,
      upcomingReminders
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
