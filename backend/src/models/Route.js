const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Route', RouteSchema);