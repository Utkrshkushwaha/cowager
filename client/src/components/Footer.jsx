import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CW</span>
            </div>
            <span className="text-xl font-bold text-white">Co<span className="text-primary-400">Wager</span></span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            A cooperative-owned digital service marketplace connecting verified skilled workers with households — ensuring fair wages, worker welfare, and consumer trust.
          </p>
          <p className="text-xs text-gray-500 mt-4">Ministry of Cooperation | NCCT Initiative</p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            {['Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Caregiver', 'Driver'].map(s => (
              <li key={s}><Link to="/services" className="hover:text-primary-400 transition-colors">{s}</Link></li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/workers" className="hover:text-primary-400 transition-colors">Find Workers</Link></li>
            <li><Link to="/register" className="hover:text-primary-400 transition-colors">Register as Worker</Link></li>
            <li><Link to="/login" className="hover:text-primary-400 transition-colors">Customer Login</Link></li>
            <li><Link to="/about" className="hover:text-primary-400 transition-colors">About CoWager</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>© 2024 CoWager. All rights reserved.</p>
        <p>Built for Labour Cooperative Federations & Societies</p>
      </div>
    </div>
  </footer>
);

export default Footer;
