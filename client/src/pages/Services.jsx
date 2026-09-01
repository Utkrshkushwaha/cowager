import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = ['all','electrician','plumber','carpenter','painter','cleaner','driver','gardener','caregiver','technician','domestic_helper'];

const Services = () => {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/services').then(res => {
      setServices(res.data);
      setFiltered(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filterByCategory = (cat) => {
    setActiveCategory(cat);
    setFiltered(cat === 'all' ? services : services.filter(s => s.category === cat));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
        <p className="text-gray-500 mt-1">Choose from our wide range of cooperative home services</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => filterByCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              activeCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <p className="text-sm text-gray-500 mb-6">{filtered.length} service{filtered.length !== 1 ? 's' : ''} found</p>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-lg font-medium">No services found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(s => <ServiceCard key={s._id} service={s} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Services;
