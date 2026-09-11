import Payment from '../models/Payment.js';
import Token from '../models/Token.js';

const RATE_PER_KG = {
  A: 25,
  B: 20,
  C: 15
};

// Create payment record
export const createPayment = async (req, res) => {
  try {
    const { token, quantityKg, qualityGrade } = req.body;

    if (!token || !quantityKg || !qualityGrade) {
      return res.status(400).json({ message: 'token, quantityKg, and qualityGrade are all required' });
    }

    const tokenData = await Token.findById(token);
    if (!tokenData) return res.status(404).json({ message: 'Token not found' });

    const rate = RATE_PER_KG[qualityGrade];
    if (!rate) return res.status(400).json({ message: 'Invalid quality grade' });

    const amount = quantityKg * rate;

    const payment = await Payment.create({
      token,
      quantityKg,
      qualityGrade,
      amount
    });

    tokenData.status = 'served';
    await tokenData.save();

    console.log(`SMS sent: Your payment of ₹${amount} is pending processing.`);

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all payments (admin view)
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'token',
        populate: [
          { path: 'farmer', select: 'name mobile' },
          { path: 'mandi', select: 'name location' }
        ]
      })
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'token',
        populate: [
          { path: 'farmer', select: 'name mobile' },
          { path: 'mandi', select: 'name location' }
        ]
      });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark payment as paid
export const markPaymentPaid = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'paid', paidAt: new Date() },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    console.log(`SMS sent: Your payment of ₹${payment.amount} has been processed.`);

    res.status(200).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get payment history for a farmer
export const getFarmerPayments = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const tokens = await Token.find({ farmer: farmerId }).select('_id');
    const tokenIds = tokens.map(t => t._id);

    const payments = await Payment.find({ token: { $in: tokenIds } })
      .populate({
        path: 'token',
        populate: { path: 'mandi', select: 'name location' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};