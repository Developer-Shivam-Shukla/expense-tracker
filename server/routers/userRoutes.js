import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected user routes
router.get('/getUser', protect, getUserProfile);
router.get('/profile', protect, getUserProfile);
router.get('/me', protect, getUserProfile);
router.put('/update', protect, updateUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

export default router;
