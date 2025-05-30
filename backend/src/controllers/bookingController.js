const Route = require('../models/Route');
const Booking = require('../models/Booking');

// Get all routes
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new booking
const createBooking = async (req, res) => {
  try {
    const { userId, routeId, date, quantity } = req.body;
    const booking = new Booking({ user: userId, route: routeId, date, quantity });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getRoutes,
  createBooking
};