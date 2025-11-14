import express from 'express';
import {

  loginUser,
  logoutUser,
  getUserProfile,
  registerUser
} from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', isAuthenticated, getUserProfile);

export default router;