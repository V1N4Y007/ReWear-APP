const express = require('express');
const router = express.Router();
const { getPlatformStats, getPendingItems, approveItem, deleteItemAsAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Custom middleware to verify Admin role
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

router.route('/stats').get(protect, adminOnly, getPlatformStats);
router.route('/items').get(protect, adminOnly, getPendingItems);
router.route('/items/:id/approve').put(protect, adminOnly, approveItem);
router.route('/items/:id').delete(protect, adminOnly, deleteItemAsAdmin);

module.exports = router;
