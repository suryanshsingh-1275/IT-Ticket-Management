
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

