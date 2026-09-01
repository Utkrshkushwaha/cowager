import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingStatusBadge from '../components/BookingStatusBadge';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const { isWorker } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchBookings = () => {
    API.get('/bookings/my').then(res => setBookings(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancel = async (id) => {
    try {
      await API.put(`/bookings/${id}/cancel`, { reason: 'Cancelled by customer' });
      toast.success('Booking cancelled');
      fetchBookings();
    } catch { toast.error('Could not cancel booking'); }
  };

  const tabs = ['all', 'pending', 'accepted', 'completed', 'cancelled'];
  const filtered = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{isWorker ? 'My Jobs' : 'My Bookings'}</h1>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6 border-b border-gray-200 pb-3">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-lg font-medium">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <div key={b._id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{b.service?.name}</h3>
                    <BookingStatusBadge status={b.status} />
                    {b.bookingType === 'emergency' && <span className="badge-red">🚨 Emergency</span>}
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>📅 {new Date(b.scheduledDate).toLocaleDateString()} at {b.scheduledTime}</p>
                    <p>📍 {b.address?.street}, {b.address?.city}</p>
                    {!isWorker && b.worker?.user && <p>👷 Worker: {b.worker.user.name} ({b.worker.user.phone})</p>}
                    {isWorker && b.customer && <p>👤 Customer: {b.customer.name} ({b.customer.phone})</p>}
                    {b.totalAmount > 0 && <p>💰 Amount: ₹{b.totalAmount}</p>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {!isWorker && b.status === 'pending' && (
                    <button onClick={() => cancel(b._id)} className="btn-danger text-sm py-1.5 px-3">Cancel</button>
                  )}
                  {b.status === 'completed' && !isWorker && (
                    <button
                      onClick={() => navigate(`/review/${b._id}`)}
                      className="btn-secondary text-sm py-1.5 px-3"
                    >
                      ⭐ Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
