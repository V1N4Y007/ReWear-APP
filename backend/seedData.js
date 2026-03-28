const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Item = require('./models/Item');
const Swap = require('./models/Swap');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rewear-db');
    console.log('MongoDB connected for seeding...');

    await User.deleteMany();
    await Item.deleteMany();
    await Swap.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Admin Boss',
      email: 'admin@example.com',
      password,
      points: 1000,
      role: 'admin'
    });

    const alice = await User.create({
      name: 'Alice Eco',
      email: 'alice@example.com',
      password,
      points: 100
    });

    const bob = await User.create({
      name: 'Bob Green',
      email: 'bob@example.com',
      password,
      points: 150
    });

    await Item.create({
      title: 'Vintage Denim Jacket',
      description: 'Classic 90s denim jacket in great condition.',
      category: 'Outerwear',
      type: 'Jacket',
      size: 'M',
      condition: 'Good',
      tags: ['vintage', 'denim'],
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=500'],
      uploader: alice._id,
      isApproved: true
    });
    
    await Item.create({
      title: 'Black Cotton Hoodie',
      description: 'Warm and cozy winter hoodie.',
      category: 'Outerwear',
      type: 'Hoodie',
      size: 'L',
      condition: 'New',
      tags: ['black', 'warm'],
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'],
      uploader: bob._id,
      isApproved: true
    });

    console.log('Sample Data Seeded Successfully! (Admin: admin@example.com / Bob: bob@example.com)');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
seedData();
