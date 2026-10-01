require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tickets', require('./routes/tickets'));

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.name === 'MulterError' || err.name === 'ValidationError' ? 400 : err.status || 500;
  res.status(status).json({ message: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 5055;
connectDB().then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)));