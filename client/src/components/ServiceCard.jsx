import React from 'react';
import { Link } from 'react-router-dom';

const categoryIcons = {
  electrician: '⚡',
  plumber: '🔧',
  carpenter: '🪚',
  painter: '🎨',
  cleaner: '🧹',
  driver: '🚗',
  gardener: '🌱',
  caregiver: '🏥',
  technician: '🔌',
  domestic_helper: '🏠',
  other: '🛠️',
};

const ServiceCard = ({ service }) => (
  <Link
    to={`/book?service=${service._id}`}
    className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-3 cursor-pointer"
  >
    <div className="text-4xl">{categoryIcons[service.category] || '🛠️'}</div>
    <div>
      <h3 className="font-semibold text-gray-900 text-lg">{service.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
    </div>
    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
      <span className="text-primary-600 font-semibold">
        ₹{service.basePrice}/{service.priceType === 'hourly' ? 'hr' : 'fixed'}
      </span>
      <span className="badge-green capitalize">{service.category.replace('_', ' ')}</span>
    </div>
  </Link>
);

export default ServiceCard;
