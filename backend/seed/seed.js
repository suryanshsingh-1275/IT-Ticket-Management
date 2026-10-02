import dns from 'dns';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import bcrypt from 'bcryptjs';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function upsertUser({ name, email, password, role, department }) {
  let user = await User.findOne({ email: email.toLowerCase() });
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!user) {
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department
    });
  } else {
    user.role = role;
    user.password = hashedPassword;
  }

  await user.save();
  return user;
}

async function runSeed() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await upsertUser({
    name: process.env.ADMIN_NAME || 'Nettech Admin',
    email: process.env.ADMIN_EMAIL || 'admin@nettech.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
    department: 'IT Support'
  });

  const demo = await upsertUser({
    name: 'Demo Employee',
    email: 'user@nettech.com',
    password: 'User@123',
    role: 'user',
    department: 'Sales'
  });

  const ticketCount = await Ticket.countDocuments();

  if (ticketCount === 0) {
    await Ticket.insertMany([
      {
        title: 'Wi-Fi keeps disconnecting',
        description:
          'Laptop drops the office Wi-Fi every 10 minutes on the 2nd floor.',
        category: 'Network',
        priority: 'High',
        status: 'Open',
        createdBy: demo._id
      },
      {
        title: 'Need Adobe Reader installed',
        description:
          'Please install Adobe Reader on my workstation to open vendor PDFs.',
        category: 'Software',
        priority: 'Low',
        status: 'In Progress',
        createdBy: demo._id
      },
      {
        title: 'Keyboard not working',
        description:
          'Several keys on my keyboard stopped responding.',
        category: 'Hardware',
        priority: 'Medium',
        status: 'Resolved',
        createdBy: demo._id
      }
    ]);

    console.log('Seeded 3 demo tickets');
  }

  console.log('\nSeed complete');
  console.log(
    `Admin  -> ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`
  );
  console.log('User   -> user@nettech.com / User@123');

  await mongoose.disconnect();
}

runSeed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});