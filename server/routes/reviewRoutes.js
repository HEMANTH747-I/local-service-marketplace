const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { createReview, getProviderReviews } = require('../controllers/reviewController');

// Customer submits review
router.post('/', authMiddleware, roleMiddleware('customer'), createReview);

// Anyone can see reviews
router.get('/:provider_id', getProviderReviews);

module.exports = router;