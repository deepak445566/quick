import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import indexingRoutes from './routes/indexingRoutes.js'; // ✅ Import indexing routes
import historyRoutes from './routes/historyRoutes.js'; 
// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://dainty-figolla-0f3ef6.netlify.app',
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/indexing', indexingRoutes); // ✅ Add indexing routes
app.use('/api/history', historyRoutes);
// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Test indexing route
app.get('/api/test-indexing', (req, res) => {
  res.json({ message: 'Indexing routes are working!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`📡 Indexing API available at: http://localhost:${PORT}/api/indexing`);
});