const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  pausedDuration: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

timeEntrySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('TimeEntry', timeEntrySchema);