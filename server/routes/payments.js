const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order for a booking
router.post('/create-order', protect, authorize('customer'), async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Mock Razorpay order (replace with actual Razorpay SDK in production)
    const mockOrder = {
      id: `order_${Date.now()}`,
      amount: amount * 100, // paise
      currency: 'INR',
      status: 'created'
    };

    booking.payment.razorpayOrderId = mockOrder.id;
    booking.totalAmount = amount;
    await booking.save();

    res.json({ order: mockOrder, bookingId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify payment after Razorpay callback
router.post('/verify', protect, async (req, res) => {
  try {
    const { bookingId, razorpayPaymentId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.payment.status = 'paid';
    booking.payment.razorpayPaymentId = razorpayPaymentId;
    booking.payment.paidAt = new Date();

    // Generate invoice number
    booking.invoice = {
      invoiceNumber: `INV-${Date.now()}`,
      generatedAt: new Date()
    };

    await booking.save();

    res.json({ message: 'Payment verified', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
