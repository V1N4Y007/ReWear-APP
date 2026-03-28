const Item = require('../models/Item');
const User = require('../models/User');

const getItems = async (req, res) => {
  try {
    const items = await Item.find({ isAvailable: true, isApproved: true }).populate('uploader', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('uploader', 'name');
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const { title, description, category, type, size, condition, tags, images } = req.body;
    
    const item = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      images,
      uploader: req.user.id
    });
    
    // Give user 10 points for listing an item
    const uploader = await User.findById(req.user.id);
    uploader.points += 10;
    await uploader.save();

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (item.uploader.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, getItemById, createItem, deleteItem };
