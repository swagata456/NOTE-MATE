const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 2000 },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ }, // YYYY-MM-DD
    time: { type: String, required: true, match: /^\d{2}:\d{2}$/ },       // HH:MM (24h)
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    completed: { type: Boolean, default: false },
    notificationSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);
