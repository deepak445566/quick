import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['submitted', 'indexed', 'failed', 'pending'],
    default: 'submitted'
  },
  googleResponse: {
    type: mongoose.Schema.Types.Mixed // Store Google API response
  },
  errorMessage: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
historySchema.index({ userId: 1, createdAt: -1 });
historySchema.index({ url: 1 });

export default mongoose.model('History', historySchema);