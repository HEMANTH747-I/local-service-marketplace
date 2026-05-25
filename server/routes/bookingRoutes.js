const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  makeBooking,
  myBookings,
  providerBookings,
  updateStatus
} = require('../controllers/bookingController');

// Customer routes
router.post('/', authMiddleware, roleMiddleware('customer'), makeBooking);
router.get('/my', authMiddleware, roleMiddleware('customer'), myBookings);

// Provider routes
router.get('/provider', authMiddleware, roleMiddleware('provider'), providerBookings);
router.put('/:id/status', authMiddleware, roleMiddleware('provider'), updateStatus);

module.exports = router;