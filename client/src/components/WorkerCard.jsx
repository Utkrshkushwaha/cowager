import React from 'react';
import { Link } from 'react-router-dom';

const categoryIcons = {
  electrician: '⚡', plumber: '🔧', carpenter: '🪚', painter: '🎨',
  cleaner: '🧹', driver: '🚗', gardener: '🌱', caregiver: '🏥',
  technician: '🔌', domestic_helper: '🏠', other: '🛠️',
};

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <svg key={star} className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-xs text-gray-500 ml-1">({rating?.toFixed(1) || '0.0'})</span>
  </div>
);

const WorkerCard = ({ worker, rank }) => {
  const { user } = worker;
  const isNearby  = worker.distanceKm !== null && worker.distanceKm <= 5;
  const isAvailable = worker.availabilityStatus === 'available';

  // Top 3 nearest available workers get an emergency-ready highlight
  const isTopPick = rank !== undefined && rank < 3 && isAvailable;

  return (
    <Link
      to={`/workers/${worker._id}`}
      className={`card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-4 relative
        ${isTopPick ? 'border-2 border-orange-400 ring-1 ring-orange-200' : ''}
      `}
    >
      {/* Top Pick / Nearest badge */}
      {isTopPick && (
        <div className="absolute -top-3 left-3 flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          🚨 {rank === 0 ? 'Nearest' : `#${rank + 1} Nearby`}
        </div>
      )}

      {/* Header */}
      <div className={`flex items-start gap-3 ${isTopPick ? 'mt-2' : ''}`}>
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-700 flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{user?.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{worker.category?.replace('_', ' ')}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-lg">{categoryIcons[worker.category] || '🛠️'}</span>
            <StarRating rating={worker.rating} />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`badge-${isAvailable ? 'green' : worker.availabilityStatus === 'busy' ? 'yellow' : 'red'} capitalize`}>
            {worker.availabilityStatus}
          </span>
          {/* Distance badge */}
          {worker.distanceKm !== null && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isNearby
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              📍 {worker.distanceKm < 1
                ? `${Math.round(worker.distanceKm * 1000)} m`
                : `${worker.distanceKm.toFixed(1)} km`}
            </span>
          )}
        </div>
      </div>

      {/* Skills */}
      {worker.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {worker.skills.slice(0, 4).map(skill => (
            <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{skill}</span>
          ))}
          {worker.skills.length > 4 && (
            <span className="text-xs text-gray-400">+{worker.skills.length - 4} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
        <div>
          <p className="text-primary-600 font-semibold">₹{worker.hourlyRate}/hr</p>
          <p className="text-xs text-gray-400">{worker.experience} yrs exp</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{worker.completedJobs} jobs done</p>
          {worker.isVerifiedByCooperative && (
            <span className="text-xs text-green-600 font-medium">✓ Verified</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default WorkerCard;
