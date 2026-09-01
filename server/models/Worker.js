const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{ type: String }],
  category: {
    type: String,
    enum: ['electrician', 'plumber', 'carpenter', 'painter', 'cleaner', 'driver', 'gardener', 'caregiver', 'technician', 'domestic_helper', 'other'],
    required: true
  },
  experience: { type: Number, default: 0 }, // in years
  certifications: [
    {
      name: String,
      issuedBy: String,
      year: Number,
      documentUrl: String
    }
  ],
  cooperativeId: { type: String, default: '' }, // assigned by cooperative federation
  isVerifiedByCooperative: { type: Boolean, default: false },
  availabilityStatus: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
  serviceRadius: { type: Number, default: 10 }, // in km
  hourlyRate: { type: Number, required: true },
  totalEarnings: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date,
    isActive: { type: Boolean, default: false }
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },
  joinedCooperativeOn: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Worker', workerSchema);
