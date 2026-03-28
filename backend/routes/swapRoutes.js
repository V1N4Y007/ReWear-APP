const express = require('express');
const router = express.Router();
const { requestSwap, respondToSwap, getUserSwaps } = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserSwaps);
router.route('/request').post(protect, requestSwap);
router.route('/:id').put(protect, respondToSwap);

module.exports = router;
