import express from 'express';
import { updateProfile, updatePassword } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.put('/profile', upload.single('avatar'), updateProfile);
router.put('/password', updatePassword);

export default router;