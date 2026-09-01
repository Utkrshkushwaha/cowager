const mongoose = require('mongoose');

const cooperativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  contactEmail: { type: String },
  contactPhone: { type: String },
  totalWorkers: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cooperative', cooperativeSchema);
