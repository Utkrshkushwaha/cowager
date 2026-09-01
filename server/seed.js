/**
 * CoWager Seed Script
 * Run: node seed.js
 * Seeds demo users (admin, worker, customer) and default services
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Worker = require('./models/Worker');
const Service = require('./models/Service');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Worker.deleteMany({});
  await Service.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create Admin
  const admin = await User.create({
    name: 'CoWager Admin',
    email: 'admin@cowager.com',
    password: 'admin123',
    phone: '9000000001',
    role: 'admin',
    isVerified: true,
    address: { city: 'New Delhi', state: 'Delhi', pincode: '110001' }
  });

  // Create Worker
  const workerUser = await User.create({
    name: 'Ramesh Kumar',
    email: 'worker@cowager.com',
    password: 'worker123',
    phone: '9000000002',
    role: 'worker',
    isVerified: true,
    address: {
      city: 'Mumbai', state: 'Maharashtra', pincode: '400001',
      coordinates: { lat: 19.0760, lng: 72.8777 } // Mumbai coords
    }
  });
  await Worker.create({
    user: workerUser._id,
    category: 'electrician',
    skills: ['Wiring', 'Switch repair', 'Fan installation', 'Inverter setup'],
    experience: 5,
    hourlyRate: 350,
    isVerifiedByCooperative: true,
    availabilityStatus: 'available',
    rating: 4.5,
    totalRatings: 24,
    completedJobs: 48,
    serviceRadius: 5000  // large radius so demo works from any location
  });

  // Create Customer
  await User.create({
    name: 'Priya Sharma',
    email: 'customer@cowager.com',
    password: 'customer123',
    phone: '9000000003',
    role: 'customer',
    isVerified: true,
    address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400002' }
  });

  // Extra demo workers with coordinates
  const extraWorkers = [
    { name: 'Suresh Yadav',  category: 'plumber',          coords: { lat: 19.0820, lng: 72.8820 }, rate: 250, skills: ['Pipe fitting','Leak repair','Drainage'] },
    { name: 'Anita Devi',    category: 'cleaner',           coords: { lat: 19.0700, lng: 72.8700 }, rate: 300, skills: ['Deep cleaning','Kitchen','Bathroom'] },
    { name: 'Mohan Singh',   category: 'carpenter',         coords: { lat: 19.1000, lng: 72.9000 }, rate: 400, skills: ['Furniture repair','Door fix','Polish'] },
    { name: 'Geeta Bai',     category: 'caregiver',         coords: { lat: 19.0600, lng: 72.8600 }, rate: 500, skills: ['Elderly care','Patient care','First aid'] },
    { name: 'Raju Patil',    category: 'technician',        coords: { lat: 19.0900, lng: 72.8900 }, rate: 450, skills: ['AC repair','Fridge','Washing machine'] },
  ];

  for (const w of extraWorkers) {
    const u = await User.create({
      name: w.name, email: `${w.name.split(' ')[0].toLowerCase()}@cowager.com`,
      password: 'worker123', phone: `90000000${Math.floor(Math.random()*90+10)}`,
      role: 'worker', isVerified: true,
      address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001', coordinates: w.coords }
    });
    await Worker.create({
      user: u._id, category: w.category, skills: w.skills,
      experience: Math.floor(Math.random() * 8 + 1),
      hourlyRate: w.rate, isVerifiedByCooperative: true,
      availabilityStatus: 'available',
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      totalRatings: Math.floor(Math.random() * 30 + 5),
      completedJobs: Math.floor(Math.random() * 50 + 10),
      serviceRadius: 5000  // large radius so demo works from any location
    });
  }

  // Seed Services
  const services = [
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
  await Service.insertMany(services);

  console.log('🌱 Seeded:');
  console.log('   Admin: admin@cowager.com / admin123');
  console.log('   Worker: worker@cowager.com / worker123');
  console.log('   Customer: customer@cowager.com / customer123');
  console.log('   10 Services seeded');
  await mongoose.disconnect();
  console.log('✅ Done!');
};

seed().catch(err => { console.error(err); process.exit(1); });
