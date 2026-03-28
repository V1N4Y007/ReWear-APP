const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  offeredItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, // Optional if paying with points
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Swap', swapSchema);
