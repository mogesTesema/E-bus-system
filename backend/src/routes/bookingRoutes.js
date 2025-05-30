const express = require('express');
const router = express.Router();
const { getRoutes, createBooking } = require('../controllers/bookingController');

// @route   GET api/bookings/routes
// @desc    Get all routes
router.get('/routes', getRoutes);

// @route   POST api/bookings/book
// @desc    Create booking
router.post('/book', createBooking);

module.exports = router;