const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createProfile,
  getMyProfile,
  getProviders,
  addService
} = require('../controllers/providerController');
const { getServicesByProvider } = require('../models/Service');

router.get('/:id/services', async (req, res) => {
  try {
    const services = await getServicesByProvider(req.params.id);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public
router.get('/', getProviders);

// Protected (provider only)
router.post('/profile', authMiddleware, roleMiddleware('provider'), createProfile);
router.get('/profile/me', authMiddleware, roleMiddleware('provider'), getMyProfile);
router.post('/services', authMiddleware, roleMiddleware('provider'), addService);

module.exports = router;