import React from 'react';
import { Link } from 'react-router-dom';

const About = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 mb-4">
        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">CW</span>
        </div>
        <span className="text-3xl font-bold">Co<span className="text-primary-600">Wager</span></span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">About CoWager</h1>
      <p className="text-gray-500 max-w-xl mx-auto">A cooperative-owned digital service marketplace built for the Ministry of Cooperation & NCCT</p>
    </div>

    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-3">🎯 Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          CoWager aims to digitally empower Labour Cooperative Federations and Societies by providing a structured platform that connects their verified skilled workers — electricians, plumbers, carpenters, painters, domestic helpers, caregivers, drivers, gardeners, cleaners, and technicians — with households and institutions requiring such services.
        </p>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-3">🏛️ Background</h2>
        <p className="text-gray-600 leading-relaxed">
          Labour Cooperative Federations across India possess a large pool of skilled workers. However, they lack a structured digital platform to connect these workers with households and institutions. Private platforms currently dominate this market, while cooperative workers often remain underutilized despite having skills and local presence. CoWager changes this.
        </p>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">⚙️ Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Service provider registration & verification',
            'Worker skill profiling & certification',
            'Customer booking & scheduling system',
            'Geo-location based service matching',
            'Digital payments & invoicing',
            'Rating & feedback mechanism',
            'Worker welfare & insurance integration',
            'Emergency & on-demand service booking',
            'Cooperative federation admin dashboard',
            'Multilingual interface support',
          ].map(f => (
            <div key={f} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-primary-600 font-bold mt-0.5">✓</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-3">🤝 Cooperative Values</h2>
        <p className="text-gray-600 leading-relaxed">
          Unlike private gig platforms that extract profit from workers, CoWager is built on cooperative principles — fair wages, worker welfare, democratic governance, and community trust. Every worker on the platform is verified by their cooperative federation and receives fair compensation.
        </p>
      </div>

      <div className="card bg-primary-50 border border-primary-100">
        <p className="text-sm text-primary-700 font-medium">🏛️ An Initiative by</p>
        <p className="text-primary-800 font-semibold mt-1">Ministry of Cooperation, Government of India</p>
        <p className="text-primary-700 text-sm">National Council for Cooperative Training (NCCT)</p>
      </div>
    </div>

    <div className="text-center mt-10">
      <Link to="/register" className="btn-primary px-8 py-3">Join CoWager Today</Link>
    </div>
  </div>
);

export default About;
