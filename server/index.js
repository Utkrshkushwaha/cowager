const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'https://cowager-app-seven.vercel.app'
  ],
  credentials: true
}));
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

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error('❌ MONGO_URI not set'); return; }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      family: 4,
      maxPoolSize: 5,
      retryWrites: true,
      w: 'majority',
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB error:', err.message);
    console.log('🔄 Retrying in 10 seconds...');
    setTimeout(connectDB, 10000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Reconnecting...');
  setTimeout(connectDB, 10000);
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
});

// Connect then start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 CoWager server running on port ${PORT}`));
}).catch(() => {
  // Start server anyway so health check works
  app.listen(PORT, () => console.log(`🚀 CoWager server running on port ${PORT} (DB pending)`));
});
