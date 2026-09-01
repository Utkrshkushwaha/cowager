const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');

// All admin routes are protected
router.use(protect, authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Get platform-wide stats for dashboard
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalWorkers = await Worker.countDocuments();
    const verifiedWorkers = await Worker.countDocuments({ isVerifiedByCooperative: true });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Bookings by category
    const bookingsByCategory = await Booking.aggregate([
      { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'serviceInfo' } },
      { $unwind: '$serviceInfo' },
      { $group: { _id: '$serviceInfo.category', count: { $sum: 1 } } }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('service', 'name category')
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalWorkers,
      verifiedWorkers,
      totalBookings,
      completedBookings,
      pendingBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      bookingsByCategory,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/toggle
// @desc    Activate or deactivate a user
router.put('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/workers
router.get('/workers', async (req, res) => {
  try {
    const workers = await Worker.find().populate('user', 'name email phone address isVerified isActive').sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter)
      .populate('service', 'name category')
      .populate('customer', 'name email phone')
      .populate({ path: 'worker', populate: { path: 'user', select: 'name phone' } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/seed-services
// @desc    Seed default services
router.post('/seed-services', async (req, res) => {
  try {
    const defaultServices = [
      { name: 'Electrical Repair', category: 'electrician', description: 'Fix wiring, switches, fans, and all electrical issues', basePrice: 300, priceType: 'hourly' },
      { name: 'Plumbing Services', category: 'plumber', description: 'Fix leaks, pipes, taps, and drainage problems', basePrice: 250, priceType: 'hourly' },
      { name: 'Carpentry Work', category: 'carpenter', description: 'Furniture repair, door fixing, and woodwork', basePrice: 350, priceType: 'hourly' },
      { name: 'House Painting', category: 'painter', description: 'Interior and exterior painting services', basePrice: 200, priceType: 'hourly' },
      { name: 'Home Cleaning', category: 'cleaner', description: 'Deep cleaning, kitchen, bathroom, and full home', basePrice: 500, priceType: 'fixed' },
      { name: 'Driver Services', category: 'driver', description: 'Personal driver for daily commute or trips', basePrice: 400, priceType: 'hourly' },
      { name: 'Gardening', category: 'gardener', description: 'Garden maintenance, pruning, and landscaping', basePrice: 300, priceType: 'hourly' },
      { name: 'Caregiver / Nursing', category: 'caregiver', description: 'Home care for elderly or patients', basePrice: 600, priceType: 'hourly' },
      { name: 'Appliance Repair', category: 'technician', description: 'Repair AC, fridge, washing machine, and appliances', basePrice: 400, priceType: 'fixed' },
      { name: 'Domestic Helper', category: 'domestic_helper', description: 'Cooking, cleaning, and household chores', basePrice: 350, priceType: 'hourly' }
    ];

    await Service.deleteMany({});
    const services = await Service.insertMany(defaultServices);
    res.json({ message: 'Services seeded', count: services.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
