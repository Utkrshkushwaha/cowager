import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';

const stats = [
  { label: 'Verified Workers', value: '500+',  icon: '👷' },
  { label: 'Services Available', value: '10+', icon: '🛠️' },
  { label: 'Happy Customers', value: '2000+',  icon: '😊' },
  { label: 'Cities Covered', value: '20+',     icon: '🏙️' },
];

const features = [
  { icon: '✅', title: 'Verified Workers',    desc: 'All workers are verified by cooperative federations ensuring trust and quality.',  bg: 'bg-indigo-50',  iconBg: 'bg-indigo-100' },
  { icon: '💰', title: 'Fair Wages',          desc: 'Cooperative-managed platform ensures fair pay for every skilled worker.',           bg: 'bg-violet-50',  iconBg: 'bg-violet-100' },
  { icon: '📍', title: 'Geo-based Matching',  desc: 'Get matched with the nearest available worker for faster service.',                 bg: 'bg-blue-50',    iconBg: 'bg-blue-100'   },
  { icon: '🔒', title: 'Secure Payments',     desc: 'Digital payments with invoicing for every completed service.',                      bg: 'bg-purple-50',  iconBg: 'bg-purple-100' },
  { icon: '⭐', title: 'Ratings & Reviews',   desc: 'Transparent feedback system builds accountability and trust.',                      bg: 'bg-indigo-50',  iconBg: 'bg-indigo-100' },
  { icon: '🚨', title: 'Emergency Booking',   desc: 'On-demand emergency services available 24/7 for urgent needs.',                     bg: 'bg-violet-50',  iconBg: 'bg-violet-100' },
];

const howItWorks = [
  { step: '01', title: 'Choose a Service',   desc: 'Browse from 10+ home and community services offered by verified cooperative workers.', icon: '🔍' },
  { step: '02', title: 'Book Instantly',     desc: 'Schedule for later or book on-demand for emergencies. Choose your date and time.',      icon: '📅' },
  { step: '03', title: 'Get it Done',        desc: 'A verified nearby worker arrives, completes the job, and you pay digitally.',           icon: '🎉' },
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    API.get('/services')
      .then(res => setServices(res.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-700 to-violet-700 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest border border-white/20">
              🏛️ Ministry of Cooperation · NCCT Initiative
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Skilled Workers.<br />
              <span className="text-violet-300">Fair Wages.</span><br />
              Community Trust.
            </h1>
            <p className="text-lg text-indigo-200 mb-10 max-w-xl leading-relaxed">
              CoWager connects verified cooperative workers — electricians, plumbers,
              cleaners, caregivers, and more — with households and institutions across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/services"
                className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-indigo-900/30 text-center text-base"
              >
                📅 Book a Service
              </Link>
              <Link
                to="/register?role=worker"
                className="border-2 border-white/50 text-white hover:bg-white/10 font-semibold py-3.5 px-8 rounded-xl transition-all text-center text-base backdrop-blur-sm"
              >
                🔧 Join as Worker
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center group">
                <p className="text-3xl mb-1">{s.icon}</p>
                <p className="text-3xl font-extrabold text-indigo-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2 block">Simple Process</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How CoWager Works</h2>
            <p className="text-gray-500 mt-2">Get a verified worker at your door in 3 easy steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-indigo-200 via-violet-300 to-indigo-200" />
            {howItWorks.map((h, i) => (
              <div key={h.step} className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-200 mb-4 relative z-10">
                  {h.icon}
                </div>
                <span className="text-xs font-bold text-indigo-400 tracking-widest mb-1">STEP {h.step}</span>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{h.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-1 block">What We Offer</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="text-gray-500 mt-1">Professional cooperative workers at your doorstep</p>
          </div>
          <Link to="/services" className="btn-secondary text-sm hidden md:block">View All →</Link>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(s => <ServiceCard key={s._id} service={s} />)}
          </div>
        )}
        <div className="text-center mt-8 md:hidden">
          <Link to="/services" className="btn-primary">View All Services</Link>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2 block">Our Advantage</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why Choose CoWager?</h2>
            <p className="text-gray-500 mt-2">A platform built on cooperative values, not profit extraction</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className={`${f.bg} rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border border-white`}>
                <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-violet-300 rounded-full blur-2xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-indigo-200 mb-8 text-base">
            Join thousands of households already using CoWager for trusted, fairly-priced home services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Create Account
            </Link>
            <Link
              to="/workers"
              className="border-2 border-white/50 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-colors"
            >
              Browse Workers
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
