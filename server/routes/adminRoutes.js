const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getPendingProviders,
  verifyProvider,
  deleteProvider,
  getAllUsers
} = require('../controllers/adminController');

// All admin routes are protected
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/providers/pending', getPendingProviders);
router.put('/providers/:id/verify', verifyProvider);
router.delete('/providers/:id', deleteProvider);
router.get('/users', getAllUsers);

module.exports = router;