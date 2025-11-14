import express from 'express';
import { google } from 'googleapis';
import { isAuthenticated } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import History from '../models/History.js'; // ✅ History model import

const router = express.Router();

// Google Indexing API setup
const indexing = google.indexing('v3');

router.post('/submit-url', isAuthenticated, async (req, res) => {
  try {
    const { url } = req.body;
    const userId = req.user._id; // ✅ User ID get karo
    
    console.log('🟡 Received URL for indexing:', url);
    console.log('🟡 User ID:', userId);
    
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

    // ✅ Pehle history record create karo
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
      // History creation fail hone par bhi indexing try karo
    }

    // Check if service account file exists
    const keyFilePath = path.resolve('./config/google-service-account.json');
    console.log('🟡 Looking for service account file at:', keyFilePath);
    
    try {
      await fs.promises.access(keyFilePath);
      console.log('✅ Service account file found');
    } catch (error) {
      console.error('🔴 Service account file not found at:', keyFilePath);
      
      // ✅ History update karo failed status ke saath
      if (historyRecord) {
        await History.findByIdAndUpdate(historyRecord._id, {
          status: 'failed',
          errorMessage: 'Google service account configuration missing'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Google service account configuration missing',
        details: `File not found: ${keyFilePath}`,
        solution: 'Please download service account JSON from Google Cloud Console and save as config/google-service-account.json'
      });
    }

    // Google Auth setup
    const authClient = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/indexing']
    });

    console.log('🟡 Authenticating with Google...');
    const client = await authClient.getClient();
    
    console.log('🟡 Submitting to Google Indexing API...');
    const response = await indexing.urlNotifications.publish({
      auth: client,
      requestBody: {
        url: url,
        type: 'URL_UPDATED'
      }
    });

    console.log('✅ URL submitted to Google:', url);
    console.log('🔵 Google API Response:', response.data);

    // ✅ History record update karo success ke saath
    if (historyRecord) {
      await History.findByIdAndUpdate(historyRecord._id, {
        status: 'indexed',
        googleResponse: response.data
      });
      console.log('✅ History record updated with success');
    }

    res.json({
      success: true,
      message: 'URL successfully submitted to Google Indexing',
      data: response.data,
      submittedUrl: url,
      historyId: historyRecord?._id, // ✅ History ID bhejo response mein
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🔴 Google Indexing Error Details:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    let errorMessage = 'Google Indexing failed';
    
    if (error.code === 403) {
      errorMessage = 'API quota exceeded or permission denied. Check if Indexing API is enabled.';
    } else if (error.code === 429) {
      errorMessage = 'Too many requests - try again later';
    } else if (error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    } else if (error.message.includes('ENOENT')) {
      errorMessage = 'Google service account file not found';
    }

    // ✅ Error case mein history record update karo
    if (req.user?._id && req.body.url) {
      try {
        await History.findOneAndUpdate(
          { userId: req.user._id, url: req.body.url },
          {
            status: 'failed',
            errorMessage: error.message
          },
          { sort: { createdAt: -1 }, new: true }
        );
        console.log('✅ History record updated with failure');
      } catch (historyError) {
        console.error('🔴 History update error:', historyError);
      }
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
      code: error.code
    });
  }
});

// ✅ Multiple URLs submit karna with history
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

    // Check service account file exists
    const keyFilePath = path.resolve('./config/google-service-account.json');
    try {
      await fs.promises.access(keyFilePath);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Google service account configuration missing'
      });
    }

    const results = [];
    const authClient = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/indexing']
    });

    const client = await authClient.getClient();

    for (const url of urls) {
      try {
        new URL(url); // Validate URL
        
        // ✅ Har URL ke liye history record create karo
        let historyRecord;
        try {
          historyRecord = await History.create({
            userId,
            url,
            status: 'submitted'
          });
        } catch (historyError) {
          console.error('History creation error for URL:', url, historyError);
        }

        const response = await indexing.urlNotifications.publish({
          auth: client,
          requestBody: {
            url: url,
            type: 'URL_UPDATED'
          }
        });

        // ✅ History update karo success ke saath
        if (historyRecord) {
          await History.findByIdAndUpdate(historyRecord._id, {
            status: 'indexed',
            googleResponse: response.data
          });
        }

        results.push({
          url,
          success: true,
          data: response.data,
          historyId: historyRecord?._id
        });

        // Thoda wait karein rate limit avoid karne ke liye
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        // ✅ Error case mein history update karo
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
      message: `Processed ${urls.length} URLs`,
      results: results
    });

  } catch (error) {
    console.error('Batch indexing error:', error);
    res.status(500).json({
      success: false,
      message: 'Batch processing failed'
    });
  }
});

export default router;