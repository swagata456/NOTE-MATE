const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, default: '', maxlength: 10000 },
    category: {
      type: String,
      enum: ['College', 'Personal', 'Work', 'Project', 'Important', 'Other'],
      default: 'Other'
    },
    tags: { type: [String], default: [] },
    important: { type: Boolean, default: false }
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model('Note', noteSchema);
