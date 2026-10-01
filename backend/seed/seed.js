require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Ticket = require('../models/Ticket');

async function upsertUser({ name, email, password, role, department }) {
  let user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    user = new User({ name, email, password, role, department });
  } else {
    user.role = role;
    user.password = password; // reset so the documented credentials always work
  }
  await user.save();
  return user;
}

