import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: {
    type: String, // ✅ Changed from ObjectId to String
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
    type: mongoose.Schema.Types.Mixed
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
historySchema.index({ userId: 1, createdAt: -1 });
historySchema.index({ url: 1 });

export default mongoose.model('History', historySchema);