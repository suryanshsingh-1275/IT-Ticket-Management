
const express = require('express');

const {
  updateProfile,
  updatePassword
} = require('../controllers/profileController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.put(
  '/profile',
  upload.single('avatar'),
  updateProfile
);

router.put(
  '/password',
  updatePassword
);

module.exports = router;

