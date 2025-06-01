const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  origin: { 
    type: String, 
    required: true,
    enum: ['Addis Ababa'] 
  },
  destination: {
    type: String,
    required: true,
    enum: ['Bahir Dar', 'Adama', 'Jimma', 'Dessie', 'Dire Dawa']
  },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Route', RouteSchema);