const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  bookingType: { type: String, enum: ['scheduled', 'emergency'], default: 'scheduled' },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  problemDescription: { type: String, default: '' },
  estimatedDuration: { type: Number, default: 1 }, // in hours
  totalAmount: { type: Number, default: 0 },
  payment: {
    status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    method: { type: String, enum: ['online', 'cash'], default: 'online' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paidAt: Date
  },
  invoice: {
    invoiceNumber: String,
    generatedAt: Date,
    url: String
  },
  cancellationReason: { type: String, default: '' },
  completedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
