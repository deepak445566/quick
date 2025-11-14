import express from 'express';
import { loginUser, logoutUser, getUserProfile } from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// ✅ Only login and logout routes
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', isAuthenticated, getUserProfile);

// ❌ NO REGISTRATION ROUTE

export default router;