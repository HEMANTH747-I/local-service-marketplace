const Review = require('../models/Review');
const pool = require('../config/db');

// Create review
const createReview = async (req, res) => {
  const { provider_id, booking_id, rating, comment, tags } = req.body;
  const customer_id = req.user.id;
  try {
    // Check booking is completed
    const result = await pool.query(
      `SELECT * FROM bookings WHERE id = $1 AND customer_id = $2 AND status = 'completed'`,
      [booking_id, customer_id]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'You can only review after service is completed' });
    }

    // Check already reviewed
    const existing = await Review.findOne({ booking_id, customer_id });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this booking' });
    }

    const review = new Review({
      booking_id,
      customer_id,
      provider_id,
      rating,
      comment,
      tags
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reviews for a provider
const getProviderReviews = async (req, res) => {
  const { provider_id } = req.params;
  try {
    const reviews = await Review.find({ provider_id: parseInt(provider_id) })
      .sort({ created_at: -1 });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({ average_rating: avgRating, total_reviews: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createReview, getProviderReviews };