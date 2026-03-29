const Swap = require('../models/Swap');
const Item = require('../models/Item');
const User = require('../models/User');
const { sendPushNotification } = require('../services/fcmService');

const requestSwap = async (req, res) => {
  try {
    const { receiverId, requestedItemId, offeredItemId } = req.body;
    
    // Check if item exists and is available
    const requestedItem = await Item.findById(requestedItemId);
    
    if (!requestedItem || !requestedItem.isAvailable) {
      return res.status(400).json({ message: 'Item is not available for swap' });
    }
    
    const swap = new Swap({
      requester: req.user.id,
      receiver: receiverId,
      requestedItem: requestedItemId,
      offeredItem: offeredItemId || null,
      status: 'Pending'
    });
    
    const createdSwap = await swap.save();

    // --- PUSH NOTIFICATION to item owner ---
    const receiver = await User.findById(receiverId);
    const requester = await User.findById(req.user.id);
    if (receiver?.fcmToken) {
      await sendPushNotification(
        receiver.fcmToken,
        '🔄 New Swap Request',
        `${requester.name} wants to swap "${requestedItem.title}" with you!`,
        { screen: 'Swaps' }
      );
    }

    res.status(201).json(createdSwap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToSwap = async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    const swap = await Swap.findById(req.params.id).populate('requestedItem');
    
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    
    if (swap.receiver.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: 'Not authorized to respond to this swap' });
    }
    
    swap.status = status;
    const updatedSwap = await swap.save();

    // --- PUSH NOTIFICATION to requester ---
    const requesterUser = await User.findById(swap.requester);
    if (requesterUser?.fcmToken) {
      const isAccepted = status === 'Accepted';
      await sendPushNotification(
        requesterUser.fcmToken,
        isAccepted ? '✅ Swap Accepted!' : '❌ Swap Declined',
        isAccepted
          ? `Your swap request for "${swap.requestedItem?.title}" was accepted!`
          : `Your swap request for "${swap.requestedItem?.title}" was declined.`,
        { screen: 'Swaps' }
      );
    }

    if (status === 'Accepted') {
      // Mark requested item as unavailable
      const item = await Item.findById(swap.requestedItem._id);
      item.isAvailable = false;
      await item.save();
      
      // If there's an offered item involved in a direct swap, mark it unavailable too
      if (swap.offeredItem) {
        const offeredItem = await Item.findById(swap.offeredItem);
        if (offeredItem) {
          offeredItem.isAvailable = false;
          await offeredItem.save();
        }
      }
    }
    
    res.json(updatedSwap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.user.id }, { receiver: req.user.id }]
    })
    .populate('requester', 'name')
    .populate('receiver', 'name')
    .populate('requestedItem')
    .populate('offeredItem');
    
    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { requestSwap, respondToSwap, getUserSwaps };
