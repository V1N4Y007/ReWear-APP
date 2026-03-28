const Item = require('../models/Item');
const User = require('../models/User');
const Swap = require('../models/Swap');

const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const totalSwaps = await Swap.countDocuments();
    res.json({ totalUsers, totalItems, totalSwaps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingItems = async (req, res) => {
  try {
    // Let's assume you fetch everything for demo, but normally filter by isApproved: false
    const items = await Item.find().populate('uploader', 'name email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    item.isApproved = true; 
    await item.save();
    res.json({ message: 'Item approved successfully', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItemAsAdmin = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    await item.deleteOne();
    res.json({ message: 'Item deleted by admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPlatformStats, getPendingItems, approveItem, deleteItemAsAdmin };
