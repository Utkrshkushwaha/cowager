const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['electrician', 'plumber', 'carpenter', 'painter', 'cleaner', 'driver', 'gardener', 'caregiver', 'technician', 'domestic_helper', 'other'],
    required: true
  },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  priceType: { type: String, enum: ['hourly', 'fixed'], default: 'hourly' },
  icon: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
