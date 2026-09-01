const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Haversine formula — calculates distance in km between two lat/lng points
const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// @route   GET /api/workers
// @desc    Get all verified workers sorted by distance if lat/lng provided
router.get('/', async (req, res) => {
  try {
    const { category, city, available, lat, lng, emergency } = req.query;

    let workerFilter = { isVerifiedByCooperative: true };
    if (category) workerFilter.category = category;

    // Emergency: only available workers
    if (emergency === 'true' || available === 'true') {
      workerFilter.availabilityStatus = 'available';
    }

    let workers = await Worker.find(workerFilter).populate(
      'user',
      'name email phone address profileImage'
    );

    // Filter by city if provided
    if (city) {
      workers = workers.filter(
        w => w.user?.address?.city?.toLowerCase() === city.toLowerCase()
      );
    }

    // Geo-sort: if customer lat/lng provided, calculate distance for each worker
    if (lat && lng) {
      const customerLat = parseFloat(lat);
      const customerLng = parseFloat(lng);

      workers = workers
        .map(w => {
          const workerLat = w.user?.address?.coordinates?.lat;
          const workerLng = w.user?.address?.coordinates?.lng;

          let distanceKm = null;
          if (workerLat && workerLng) {
            distanceKm = getDistanceKm(customerLat, customerLng, workerLat, workerLng);
            // Filter out workers beyond their service radius
            if (distanceKm > w.serviceRadius) return null;
          }

          return { ...w.toObject(), distanceKm };
        })
        .filter(Boolean); // remove nulls (out of range)

      // Sort: available workers first, then by distance
      workers.sort((a, b) => {
        // Available workers always come first
        if (a.availabilityStatus === 'available' && b.availabilityStatus !== 'available') return -1;
        if (b.availabilityStatus === 'available' && a.availabilityStatus !== 'available') return 1;

        // Among same availability, sort by distance (nearest first)
        if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
        if (a.distanceKm !== null) return -1;
        if (b.distanceKm !== null) return 1;

        // Fall back to rating
        return b.rating - a.rating;
      });
    } else {
      // No location: sort available first, then by rating
      workers = workers
        .map(w => ({ ...w.toObject(), distanceKm: null }))
        .sort((a, b) => {
          if (a.availabilityStatus === 'available' && b.availabilityStatus !== 'available') return -1;
          if (b.availabilityStatus === 'available' && a.availabilityStatus !== 'available') return 1;
          return b.rating - a.rating;
        });
    }

    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/workers/:id
// @desc    Get single worker profile
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('user', 'name email phone address profileImage');
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/workers/my/profile
// @desc    Get logged-in worker's own profile
router.get('/my/profile', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id }).populate('user', 'name email phone address profileImage');
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/workers/my/profile
// @desc    Update worker profile
router.put('/my/profile', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    const { skills, experience, hourlyRate, serviceRadius, availabilityStatus, certifications, bankDetails } = req.body;

    if (skills) worker.skills = skills;
    if (experience !== undefined) worker.experience = experience;
    if (hourlyRate) worker.hourlyRate = hourlyRate;
    if (serviceRadius) worker.serviceRadius = serviceRadius;
    if (availabilityStatus) worker.availabilityStatus = availabilityStatus;
    if (certifications) worker.certifications = certifications;
    if (bankDetails) worker.bankDetails = bankDetails;

    const updated = await worker.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/workers/:id/verify
// @desc    Admin verifies a worker
router.put('/:id/verify', protect, authorize('admin'), async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    worker.isVerifiedByCooperative = true;
    await worker.save();

    // Also mark user as verified
    await User.findByIdAndUpdate(worker.user, { isVerified: true });

    res.json({ message: 'Worker verified successfully', worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/workers/unverified/list
// @desc    Admin gets list of unverified workers
router.get('/unverified/list', protect, authorize('admin'), async (req, res) => {
  try {
    const workers = await Worker.find({ isVerifiedByCooperative: false }).populate('user', 'name email phone address');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
