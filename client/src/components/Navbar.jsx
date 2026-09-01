import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isWorker } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors duration-200 ${
        isActive(to) ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CW</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Co<span className="text-primary-600">Wager</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLink('/services', 'Services')}
            {navLink('/workers', 'Workers')}
            {!user && navLink('/about', 'About')}
            {user && isWorker && navLink('/worker/dashboard', 'My Dashboard')}
            {user && !isWorker && !isAdmin && navLink('/bookings', 'My Bookings')}
            {user && isAdmin && navLink('/admin', 'Admin Panel')}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-xs">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-4">
            <Link to="/services" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link to="/workers" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>Workers</Link>
            {user ? (
              <>
                <Link to="/profile" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>Profile</Link>
                {isWorker && <Link to="/worker/dashboard" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
                {!isWorker && !isAdmin && <Link to="/bookings" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>My Bookings</Link>}
                {isAdmin && <Link to="/admin" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-sm font-medium text-red-600 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm text-center" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
