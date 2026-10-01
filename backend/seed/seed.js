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

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await upsertUser({
    name: process.env.ADMIN_NAME || 'Nettech Admin',
    email: process.env.ADMIN_EMAIL || 'admin@nettech.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
    department: 'IT Support',
  });

  const demo = await upsertUser({
    name: 'Demo Employee',
    email: 'user@nettech.com',
    password: 'User@123',
    role: 'user',
    department: 'Sales',
  });

  if ((await Ticket.countDocuments()) === 0) {
    await Ticket.insertMany([
      { title: 'Wi-Fi keeps disconnecting', description: 'Laptop drops the office Wi-Fi every 10 minutes on the 2nd floor.', category: 'Network', priority: 'High', status: 'Open', createdBy: demo._id },
      { title: 'Need Adobe Reader installed', description: 'Please install Adobe Reader on my workstation to open vendor PDFs.', category: 'Software', priority: 'Low', status: 'In Progress', createdBy: demo._id },
      { title: 'Keyboard not working', description: 'Several keys on my keyboard stopped responding.', category: 'Hardware', priority: 'Medium', status: 'Resolved', createdBy: demo._id },
    ]);
    console.log('Seeded 3 demo tickets');
  }

  console.log('\nSeed complete');
  console.log(`Admin  -> ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
  console.log('User   -> user@nettech.com / User@123');
  await mongoose.disconnect();
})().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});