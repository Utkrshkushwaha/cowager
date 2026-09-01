import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingStatusBadge from '../components/BookingStatusBadge';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [availability, setAvailability] = useState('available');

  useEffect(() => {
    Promise.all([
      API.get('/workers/my/profile'),
      API.get('/bookings/my'),
      API.get('/bookings/pending')
    ]).then(([pRes, myRes, pendingRes]) => {
      setProfile(pRes.data);
      setMyJobs(myRes.data);
      setPendingJobs(pendingRes.data);
      setAvailability(pRes.data.availabilityStatus);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const acceptJob = async (bookingId) => {
    try {
      await API.put(`/bookings/${bookingId}/accept`);
      toast.success('Job accepted!');
      setPendingJobs(p => p.filter(b => b._id !== bookingId));
      const res = await API.get('/bookings/my');
      setMyJobs(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept job');
    }
  };

  const completeJob = async (bookingId) => {
    const amount = window.prompt('Enter total service amount (₹):');
    if (!amount) return;
    try {
      await API.put(`/bookings/${bookingId}/complete`, { totalAmount: Number(amount) });
      toast.success('Job marked as complete!');
      const res = await API.get('/bookings/my');
      setMyJobs(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete job');
    }
  };

  const updateAvailability = async (status) => {
    try {
      await API.put('/workers/my/profile', { availabilityStatus: status });
      setAvailability(status);
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'Completed Jobs', value: profile?.completedJobs || 0, icon: '✅' },
    { label: 'Total Earnings', value: `₹${profile?.totalEarnings || 0}`, icon: '💰' },
    { label: 'Rating', value: `${profile?.rating?.toFixed(1) || '0.0'} ⭐`, icon: '⭐' },
    { label: 'Pending Requests', value: pendingJobs.length, icon: '📋' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          <select
            value={availability}
            onChange={e => updateAvailability(e.target.value)}
            className="input-field w-auto text-sm"
          >
            <option value="available">🟢 Available</option>
            <option value="busy">🟡 Busy</option>
            <option value="offline">🔴 Offline</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Verification Alert */}
      {!profile?.isVerifiedByCooperative && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <span className="text-yellow-500 text-xl">⚠️</span>
          <div>
            <p className="font-medium text-yellow-800">Verification Pending</p>
            <p className="text-sm text-yellow-700">Your profile is awaiting verification by the cooperative federation. You can still receive job requests once verified.</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-3">
        {['pending', 'my_jobs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'pending' ? `📋 New Requests (${pendingJobs.length})` : `🔧 My Jobs (${myJobs.length})`}
          </button>
        ))}
      </div>

      {/* Pending Jobs */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingJobs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">📭</p>
              <p>No pending job requests right now</p>
            </div>
          ) : pendingJobs.map(b => (
            <div key={b._id} className="card">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{b.service?.name}</h3>
                  <div className="text-sm text-gray-500 mt-1 space-y-1">
                    <p>📅 {new Date(b.scheduledDate).toLocaleDateString()} at {b.scheduledTime}</p>
                    <p>📍 {b.address?.city}, {b.address?.state}</p>
                    <p>👤 {b.customer?.name}</p>
                    {b.problemDescription && <p>📝 {b.problemDescription}</p>}
                    {b.bookingType === 'emergency' && <span className="badge-red">🚨 Emergency</span>}
                  </div>
                </div>
                <button onClick={() => acceptJob(b._id)} className="btn-primary self-start sm:self-center px-6">
                  Accept Job
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Jobs */}
      {activeTab === 'my_jobs' && (
        <div className="space-y-4">
          {myJobs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">🔧</p>
              <p>No jobs yet. Accept requests to get started!</p>
            </div>
          ) : myJobs.map(b => (
            <div key={b._id} className="card">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{b.service?.name}</h3>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>📅 {new Date(b.scheduledDate).toLocaleDateString()} at {b.scheduledTime}</p>
                    <p>📍 {b.address?.street}, {b.address?.city}</p>
                    <p>👤 Customer: {b.customer?.name} · {b.customer?.phone}</p>
                    {b.totalAmount > 0 && <p>💰 ₹{b.totalAmount}</p>}
                  </div>
                </div>
                {b.status === 'accepted' && (
                  <button onClick={() => completeJob(b._id)} className="btn-primary self-start sm:self-center px-6">
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
