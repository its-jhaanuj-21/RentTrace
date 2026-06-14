import express from 'express';
import Payment from '../models/Payment.js';
import Settings from '../models/Settings.js';

const router = express.Router();

// GET /api/payments
router.get('/', async (req, res) => {
  try {
    // Only return payments owned by the authenticated user
    const payments = await Payment.find({ userId: req.user.id }).sort({ month: -1, date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving payments', error: error.message });
  }
});

// POST /api/payments
router.post('/', async (req, res) => {
  try {
    const paymentData = req.body;
    // Strip client-generated ID
    delete paymentData.id;

    // Attach user ID
    paymentData.userId = req.user.id;

    const payment = new Payment(paymentData);
    await payment.save();

    // Also update Settings initialMeterReading to the new currMeter if it's a valid reading (> 0)
    if (payment.currMeter !== undefined && payment.currMeter > 0) {
      await Settings.findOneAndUpdate(
        { userId: req.user.id },
        { initialMeterReading: payment.currMeter },
        { new: true, upsert: true }
      );
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Error saving payment', error: error.message });
  }
});

// DELETE /api/payments/:id
router.delete('/:id', async (req, res) => {
  try {
    // Ensure the payment belongs to the authenticated user before deletion
    const payment = await Payment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found or unauthorized' });
    }
    res.json({ message: 'Payment record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error: error.message });
  }
});

export default router;
