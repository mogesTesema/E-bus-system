const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  date: { type: Date, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Booking', BookingSchema);