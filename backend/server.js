require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 5000, MONGODB_URI, JWT_SECRET } = process.env;

if (!MONGODB_URI || !JWT_SECRET) {
  console.error('Missing MONGODB_URI or JWT_SECRET. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const app = express();
app.use(express.json());

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Unknown API route
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found' }));

// Serve the built React frontend (created by `npm run build` inside the frontend folder)
const distDir = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distDir));

// React Router handles pages like /notes, so any other GET returns index.html
app.get('*', (req, res) => {
  const indexFile = path.join(distDir, 'index.html');
  if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
  res
    .status(503)
    .send('Frontend not built yet. Open a terminal in the frontend folder and run: npm install, then npm run build.');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`NOTE-MATE running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
