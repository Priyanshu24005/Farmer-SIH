import Token from '../models/Token.js';
import Mandi from '../models/Mandi.js';

// Book a new token
export const bookToken = async (req, res) => {
  try {
    const { farmer, mandi, date } = req.body;

    if (!farmer || !mandi || !date) {
      return res.status(400).json({ message: 'farmer, mandi, and date are all required' });
    }

    const mandiData = await Mandi.findById(mandi);
    if (!mandiData) return res.status(404).json({ message: 'Mandi not found' });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const tokenCountToday = await Token.countDocuments({
      mandi,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' }
    });

    if (tokenCountToday >= mandiData.dailyCapacity) {
      return res.status(400).json({ message: 'Daily capacity full for this mandi' });
    }

    const newTokenNumber = tokenCountToday + 1;

    const token = await Token.create({
      farmer,
      mandi,
      date,
      tokenNumber: newTokenNumber
    });

    mandiData.currentTokenCount = newTokenNumber;
    await mandiData.save();

    res.status(201).json(token);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single token by ID
export const getTokenById = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id)
      .populate('farmer', 'name mobile cropType')
      .populate('mandi', 'name location');
    if (!token) return res.status(404).json({ message: 'Token not found' });
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get live queue for a specific mandi (today's waiting tokens)
export const getMandiQueue = async (req, res) => {
  try {
    const { mandiId } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const queue = await Token.find({
      mandi: mandiId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'waiting'
    })
      .populate('farmer', 'name mobile cropType')
      .sort({ tokenNumber: 1 });

    res.status(200).json(queue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update token status (served / cancelled)
export const updateTokenStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['waiting', 'served', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const token = await Token.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!token) return res.status(404).json({ message: 'Token not found' });

    res.status(200).json(token);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all tokens for a specific farmer (history)
export const getFarmerTokens = async (req, res) => {
  try {
    const tokens = await Token.find({ farmer: req.params.farmerId })
      .populate('mandi', 'name location')
      .sort({ createdAt: -1 });
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};