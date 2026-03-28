const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true }, // e.g. Tops, Bottoms, Shoes
  size: { type: String, required: true },
  condition: { type: String, required: true }, // New, Good, Fair
  tags: [{ type: String }],
  images: [{ type: String }],
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
