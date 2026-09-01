import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Workers from './pages/Workers';
import WorkerDetail from './pages/WorkerDetail';
import BookService from './pages/BookService';
import MyBookings from './pages/MyBookings';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import About from './pages/About';
import Review from './pages/Review';

const App = () => (
  <AuthProvider>
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/workers/:id" element={<WorkerDetail />} />
            <Route path="/about" element={<About />} />

            {/* Customer */}
            <Route path="/book" element={
              <ProtectedRoute roles={['customer']}>
                <BookService />
              </ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute roles={['customer', 'worker']}>
                <MyBookings />
              </ProtectedRoute>
            } />

            {/* Worker */}
            <Route path="/worker/dashboard" element={
              <ProtectedRoute roles={['worker']}>
                <WorkerDashboard />
              </ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Review */}
            <Route path="/review/:bookingId" element={
              <ProtectedRoute roles={['customer']}>
                <Review />
              </ProtectedRoute>
            } />

            {/* Profile */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <p className="text-6xl mb-4">🔍</p>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Router>
  </AuthProvider>
);

export default App;
