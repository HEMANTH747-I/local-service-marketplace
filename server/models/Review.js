const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking_id: { type: Number, required: true },
  customer_id: { type: Number, required: true },
  provider_id: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  tags: [{ type: String }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);