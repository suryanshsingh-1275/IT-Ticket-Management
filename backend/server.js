import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/tickets', ticketRoutes);

const frontendPath = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendPath));

app.use((req, res, next) => {
  if (
    req.method === 'GET' &&
    !req.path.startsWith('/api/') &&
    !req.path.startsWith('/uploads/')
  ) {
    return res.sendFile(path.join(frontendPath, 'index.html'));
  }

  next();
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);

  const status =
    err.name === 'MulterError' || err.name === 'ValidationError'
      ? 400
      : err.status || 500;

  res.status(status).json({
    message: err.message || 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5055;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
});