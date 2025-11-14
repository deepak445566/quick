import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import indexingRoutes from './routes/indexingRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ✅ IMPORTANT: CORS must come FIRST
app.use(cors({
  origin: function (origin, callback) {
    // ✅ Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'https://dapper-druid-feb24d.netlify.app',
     
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ✅ Then other middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/indexing', indexingRoutes);
app.use('/api/history', historyRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Test route for cookies
app.get('/api/test-cookie', (req, res) => {
  res.cookie('test_cookie', 'hello_world', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });
  
  res.json({ 
    message: 'Test cookie set',
    cookies: req.cookies
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 CORS enabled for: http://localhost:5173`);
});