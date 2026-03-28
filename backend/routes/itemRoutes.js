const express = require('express');
const router = express.Router();
const { getItems, getItemById, createItem, deleteItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getItems).post(protect, createItem);
router.route('/:id').get(getItemById).delete(protect, deleteItem);

module.exports = router;
