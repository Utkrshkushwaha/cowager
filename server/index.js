const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'CoWager API is running 🚀', version: '1.0.0' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

// Start server immediately — don't wait for DB
app.listen(PORT, () => console.log(`🚀 CoWager server running on port ${PORT}`));

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log('🔄 Connecting to MongoDB...');
  console.log('URI prefix:', uri ? uri.substring(0, 40) + '...' : 'NOT SET');

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 — fixes DNS issues on some hosting providers
      maxPoolSize: 10,
      minPoolSize: 1,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Reconnecting...');
  setTimeout(connectDB, 5000);
});

connectDB();
