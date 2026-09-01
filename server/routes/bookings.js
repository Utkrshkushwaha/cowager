const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Customer creates a booking
router.post('/', protect, authorize('customer'), async (req, res) => {
  try {
    const { serviceId, scheduledDate, scheduledTime, address, problemDescription, bookingType, estimatedDuration } = req.body;

    // Find nearest available worker for the service category (simple geo matching)
    const booking = await Booking.create({
      customer: req.user._id,
      service: serviceId,
      scheduledDate,
      scheduledTime,
      address,
      problemDescription,
      bookingType: bookingType || 'scheduled',
      estimatedDuration: estimatedDuration || 1,
      status: 'pending'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/my
// @desc    Get current customer's bookings
router.get('/my', protect, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'customer') {
      bookings = await Booking.find({ customer: req.user._id })
        .populate('service', 'name category')
        .populate({ path: 'worker', populate: { path: 'user', select: 'name phone' } })
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'worker') {
      const worker = await Worker.findOne({ user: req.user._id });
      if (!worker) return res.status(404).json({ message: 'Worker profile not found' });
      bookings = await Booking.find({ worker: worker._id })
        .populate('service', 'name category')
        .populate('customer', 'name phone address')
        .sort({ createdAt: -1 });
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/pending
// @desc    Worker gets pending bookings near them
router.get('/pending', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    const pendingBookings = await Booking.find({ status: 'pending', worker: null })
      .populate('service', 'name category basePrice')
      .populate('customer', 'name phone address')
      .sort({ createdAt: -1 });

    res.json(pendingBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service')
      .populate('customer', 'name email phone address')
      .populate({ path: 'worker', populate: { path: 'user', select: 'name phone' } });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id/accept
// @desc    Worker accepts a booking
router.put('/:id/accept', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Booking is no longer pending' });

    booking.worker = worker._id;
    booking.status = 'accepted';
    await booking.save();

    worker.availabilityStatus = 'busy';
    await worker.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id/complete
// @desc    Worker marks booking as complete
router.put('/:id/complete', protect, authorize('worker'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const worker = await Worker.findOne({ user: req.user._id });
    if (booking.worker.toString() !== worker._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'completed';
    booking.completedAt = new Date();
    const { totalAmount } = req.body;
    if (totalAmount) booking.totalAmount = totalAmount;

    await booking.save();

    // Update worker stats
    worker.completedJobs += 1;
    worker.totalEarnings += booking.totalAmount;
    worker.availabilityStatus = 'available';
    await worker.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Customer cancels a booking
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || '';
    await booking.save();

    // Free up worker if assigned
    if (booking.worker) {
      await Worker.findByIdAndUpdate(booking.worker, { availabilityStatus: 'available' });
    }

    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings (admin)
// @desc    Admin gets all bookings
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('service', 'name category')
      .populate('customer', 'name email phone')
      .populate({ path: 'worker', populate: { path: 'user', select: 'name phone' } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
