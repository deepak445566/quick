import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import History from '../models/History.js';

const router = express.Router();

router.post('/submit-url', isAuthenticated, async (req, res) => {
  try {
    const { url } = req.body;
    const userId = req.user._id;
    
    console.log('🟡 Received URL for indexing:', url);
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL is required' 
      });
    }

    // URL validation
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid URL format' 
      });
    }

    // ✅ History record create karo
    let historyRecord;
    try {
      historyRecord = await History.create({
        userId,
        url,
        status: 'submitted'
      });
      console.log('✅ History record created:', historyRecord._id);
    } catch (historyError) {
      console.error('🔴 History creation error:', historyError);
    }

    // ✅ SIMULATE SUCCESS - Google API integration ke bina
    console.log('✅ Simulating Google Indexing for:', url);
    
    // History update karo simulated success ke saath
    if (historyRecord) {
      await History.findByIdAndUpdate(historyRecord._id, {
        status: 'indexed',
        googleResponse: { 
          simulated: true,
          message: 'Indexing simulation - Real Google API integration required'
        }
      });
    }

    res.json({
      success: true,
      message: 'URL submitted for indexing (Demo Mode)',
      submittedUrl: url,
      historyId: historyRecord?._id,
      timestamp: new Date().toISOString(),
      note: 'Real Google Indexing API integration required for production'
    });

  } catch (error) {
    console.error('🔴 Error:', error);
    
    // Error case mein history update karo
    if (req.user?._id && req.body.url) {
      try {
        await History.findOneAndUpdate(
          { userId: req.user._id, url: req.body.url },
          {
            status: 'failed',
            errorMessage: error.message
          },
          { sort: { createdAt: -1 } }
        );
      } catch (historyError) {
        console.error('History update error:', historyError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Processing failed',
      error: error.message
    });
  }
});

// ✅ Batch URLs - Simulated version
router.post('/submit-batch', isAuthenticated, async (req, res) => {
  try {
    const { urls } = req.body;
    const userId = req.user._id;
    
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ 
        success: false, 
        message: 'URLs array is required' 
      });
    }

    const results = [];

    for (const url of urls) {
      try {
        new URL(url); // Validate URL
        
        // History record create karo
        let historyRecord;
        try {
          historyRecord = await History.create({
            userId,
            url,
            status: 'submitted'
          });
        } catch (historyError) {
          console.error('History creation error:', historyError);
        }

        // Simulate success
        if (historyRecord) {
          await History.findByIdAndUpdate(historyRecord._id, {
            status: 'indexed'
          });
        }

        results.push({
          url,
          success: true,
          historyId: historyRecord?._id
        });

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        // Error handling
        if (userId && url) {
          try {
            await History.findOneAndUpdate(
              { userId, url },
              {
                status: 'failed',
                errorMessage: error.message
              },
              { sort: { createdAt: -1 } }
            );
          } catch (historyError) {
            console.error('History update error:', historyError);
          }
        }

        results.push({
          url,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Processed ${urls.length} URLs (Demo Mode)`,
      results: results,
      note: 'Real Google API integration required'
    });

  } catch (error) {
    console.error('Batch processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Batch processing failed'
    });
  }
});

export default router;