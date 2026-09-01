const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Customer submits a review after completed booking
router.post('/', protect, authorize('customer'), async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'completed') return res.status(400).json({ message: 'Can only review completed bookings' });
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ booking: bookingId });
    if (existing) return res.status(400).json({ message: 'Already reviewed this booking' });

    const review = await Review.create({
      booking: bookingId,
      customer: req.user._id,
      worker: booking.worker,
      rating,
      comment
    });

    // Update worker's average rating
    const worker = await Worker.findById(booking.worker);
    const newTotal = worker.totalRatings + 1;
    const newRating = ((worker.rating * worker.totalRatings) + rating) / newTotal;
    worker.rating = Math.round(newRating * 10) / 10;
    worker.totalRatings = newTotal;
    await worker.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reviews/worker/:workerId
// @desc    Get all reviews for a worker
router.get('/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.workerId })
      .populate('customer', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
