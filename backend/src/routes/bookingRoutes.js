const express = require('express');
const router = express.Router();
const { getRoutes, createBooking } = require('../controllers/bookingController');
router.get('/routes', getRoutes);
router.post('/book', createBooking);
module.exports = router;