import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

// ES modules don't have __dirname built in, so we build it ourselves
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5055' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/tickets', ticketRoutes);

// catch any route that doesn't match the ones above
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// catches errors thrown anywhere in the app
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.name === 'MulterError' || err.name === 'ValidationError' ? 400 : err.status || 500;
  res.status(status).json({ message: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 5055;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
});