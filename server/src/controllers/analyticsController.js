import Token from '../models/Token.js';
import Payment from '../models/Payment.js';
import Farmer from '../models/Farmer.js';
import Mandi from '../models/Mandi.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalFarmers = await Farmer.countDocuments();
    const totalMandis = await Mandi.countDocuments();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tokensToday = await Token.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const servedToday = await Token.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'served'
    });

    const waitingNow = await Token.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'waiting'
    });

    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const paidPayments = await Payment.countDocuments({ status: 'paid' });

    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      totalFarmers,
      totalMandis,
      tokensToday,
      servedToday,
      waitingNow,
      pendingPayments,
      paidPayments,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMandiStats = async (req, res) => {
  try {
    const { mandiId } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tokensToday = await Token.countDocuments({
      mandi: mandiId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const servedToday = await Token.countDocuments({
      mandi: mandiId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'served'
    });

    const waitingNow = await Token.countDocuments({
      mandi: mandiId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'waiting'
    });

    res.status(200).json({ tokensToday, servedToday, waitingNow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};