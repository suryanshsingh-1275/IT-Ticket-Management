
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, phone, department } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: 'Name cannot be empty'
        });
      }

      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (department !== undefined) {
      user.department = department;
    }

    if (req.file) {
      if (user.avatar) {
        fs.unlink(
          path.join(__dirname, '..', user.avatar),
          () => {}
        );
      }

      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({ user });

  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: 'Enter your current password and a new one (6+ characters)'
      });
    }

    const user = await User.findById(req.user._id)
      .select('+password');

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Current password is incorrect'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      message: 'Password updated'
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateProfile,
  updatePassword
};

