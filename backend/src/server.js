require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('E-Bus Ticket System API');
});

// Create default routes if empty
const createDefaultRoutes = async () => {
  const Route = require('./models/Route');
  const count = await Route.countDocuments();
  if (count === 0) {
    await Route.insertMany([
      { origin: 'Addis Ababa', destination: 'Adama', price: 200 },
      { origin: 'Addis Ababa', destination: 'Gimma', price: 340 },
      { origin: 'Addis Ababa', destination: 'Dir Dawa', price: 30 },
      {origin: 'Adama', destination:'Addis Ababa'}
    ]);
    console.log('Default routes created');
  }
};
createDefaultRoutes();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});