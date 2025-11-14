import express from 'express';
import History from '../models/History.js';
import { isAuthenticated } from '../middleware/auth.js';



const router = express.Router();

// ✅ User ka indexing history get karna
router.get('/my-history', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const history = await History.find({ userId })
      .sort({ createdAt: -1 }) // Latest first
      .limit(50); // Last 50 records

    res.json({
      success: true,
      data: history,
      count: history.length
    });

  } catch (error) {
    console.error('🔴 History fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history'
    });
  }
});

// ✅ Single history record get karna
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const history = await History.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'History record not found'
      });
    }

    res.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('🔴 History detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history details'
    });
  }
});

// ✅ History record delete karna
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const history = await History.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'History record not found'
      });
    }

    res.json({
      success: true,
      message: 'History record deleted successfully'
    });

  } catch (error) {
    console.error('🔴 History delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete history record'
    });
  }
});

export default router;