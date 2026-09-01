import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(s => (
      <svg key={s} className={`w-5 h-5 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="ml-1 text-gray-600 font-medium">{rating?.toFixed(1) || '0.0'}</span>
  </div>
);

const WorkerDetail = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get(`/workers/${id}`),
      API.get(`/reviews/worker/${id}`)
    ]).then(([wRes, rRes]) => {
      setWorker(wRes.data);
      setReviews(rRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!worker) return <div className="text-center py-20 text-gray-400">Worker not found</div>;

  const { user } = worker;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-700 flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-500 capitalize">{worker.category?.replace('_', ' ')}</p>
                <div className="mt-2"><StarRating rating={worker.rating} /></div>
                <p className="text-xs text-gray-400 mt-1">{worker.totalRatings} review{worker.totalRatings !== 1 ? 's' : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">₹{worker.hourlyRate}/hr</p>
                <span className={`badge-${worker.availabilityStatus === 'available' ? 'green' : 'yellow'} mt-1`}>
                  {worker.availabilityStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 text-center">
              <div><p className="text-lg font-bold text-gray-900">{worker.completedJobs}</p><p className="text-xs text-gray-500">Jobs Done</p></div>
              <div><p className="text-lg font-bold text-gray-900">{worker.experience} yrs</p><p className="text-xs text-gray-500">Experience</p></div>
              <div><p className="text-lg font-bold text-gray-900">{worker.serviceRadius} km</p><p className="text-xs text-gray-500">Service Radius</p></div>
            </div>
          </div>
        </div>

        {/* Verification Badge */}
        {worker.isVerifiedByCooperative && (
          <div className="mt-4 flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span>✅</span>
            <span className="text-sm font-medium">Verified by Labour Cooperative Federation</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Skills & Certs */}
        <div className="md:col-span-1 space-y-4">
          {worker.skills?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map(skill => (
                  <span key={skill} className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-medium">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {worker.certifications?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
              <ul className="space-y-2">
                {worker.certifications.map((cert, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-medium text-gray-800">{cert.name}</p>
                    <p className="text-gray-500">{cert.issuedBy} • {cert.year}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Reviews + Book */}
        <div className="md:col-span-2 space-y-4">
          <Link to={`/book?worker=${worker._id}`} className="btn-primary w-full py-3 text-center text-lg block">
            📅 Book {user?.name}
          </Link>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Customer Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet. Be the first to book!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r._id} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-800 text-sm">{r.customer?.name}</p>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} className={`w-4 h-4 ${s <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{r.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetail;
