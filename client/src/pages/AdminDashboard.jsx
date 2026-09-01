import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingStatusBadge from '../components/BookingStatusBadge';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

const StatCard = ({ label, value, icon, color }) => (
  <div className={`card border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/stats'),
      API.get('/admin/workers'),
      API.get('/admin/bookings')
    ]).then(([sRes, wRes, bRes]) => {
      setStats(sRes.data);
      setWorkers(wRes.data);
      setBookings(bRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const seedServices = async () => {
    try {
      await API.post('/admin/seed-services');
      toast.success('Default services seeded!');
    } catch { toast.error('Failed to seed services'); }
  };

  const verifyWorker = async (workerId) => {
    try {
      await API.put(`/workers/${workerId}/verify`);
      toast.success('Worker verified!');
      setWorkers(ws => ws.map(w => w._id === workerId ? { ...w, isVerifiedByCooperative: true } : w));
    } catch { toast.error('Failed to verify worker'); }
  };

  const _toggleUser = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/toggle`);
      toast.success('User status updated');
    } catch { toast.error('Failed to toggle user'); }
  };

  if (loading) return <LoadingSpinner />;

  const tabs = ['overview', 'workers', 'bookings'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">CoWager Cooperative Federation Panel</p>
        </div>
        <button onClick={seedServices} className="btn-secondary text-sm">🌱 Seed Services</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200 pb-3">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'workers' ? '👷 Workers' : '📋 Bookings'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Customers" value={stats.totalUsers} icon="👤" color="border-blue-500" />
            <StatCard label="Total Workers" value={stats.totalWorkers} icon="👷" color="border-green-500" />
            <StatCard label="Verified Workers" value={stats.verifiedWorkers} icon="✅" color="border-primary-500" />
            <StatCard label="Total Bookings" value={stats.totalBookings} icon="📋" color="border-purple-500" />
            <StatCard label="Completed" value={stats.completedBookings} icon="🎉" color="border-green-500" />
            <StatCard label="Pending" value={stats.pendingBookings} icon="⏳" color="border-yellow-500" />
            <StatCard label="Total Revenue" value={`₹${stats.totalRevenue?.toLocaleString()}`} icon="💰" color="border-emerald-500" />
          </div>

          {/* Charts */}
          {stats.bookingsByCategory?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Bookings by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.bookingsByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#16a34a" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={stats.bookingsByCategory} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label={({ _id, percent }) => `${_id} ${(percent*100).toFixed(0)}%`}>
                      {stats.bookingsByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent Bookings */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Service</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentBookings?.map(b => (
                    <tr key={b._id} className="hover:bg-gray-50">
                      <td className="py-2">{b.customer?.name}</td>
                      <td className="py-2">{b.service?.name}</td>
                      <td className="py-2">{new Date(b.scheduledDate).toLocaleDateString()}</td>
                      <td className="py-2"><BookingStatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Workers Tab */}
      {activeTab === 'workers' && (
        <div className="space-y-4">
          {workers.map(w => (
            <div key={w._id} className="card">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{w.user?.name}</h3>
                    {w.isVerifiedByCooperative
                      ? <span className="badge-green">✓ Verified</span>
                      : <span className="badge-yellow">⏳ Pending</span>}
                  </div>
                  <div className="text-sm text-gray-500 space-y-0.5">
                    <p>📧 {w.user?.email} · 📱 {w.user?.phone}</p>
                    <p>🔧 {w.category?.replace('_', ' ')} · ₹{w.hourlyRate}/hr · {w.experience} yrs exp</p>
                    <p>📍 {w.user?.address?.city}, {w.user?.address?.state}</p>
                  </div>
                </div>
                {!w.isVerifiedByCooperative && (
                  <button onClick={() => verifyWorker(w._id)} className="btn-primary self-start sm:self-center text-sm px-4">
                    ✓ Verify Worker
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b._id} className="card">
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{b.service?.name}</h3>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <div className="text-sm text-gray-500 space-y-0.5">
                    <p>👤 {b.customer?.name} · 📅 {new Date(b.scheduledDate).toLocaleDateString()}</p>
                    <p>👷 Worker: {b.worker?.user?.name || 'Not assigned'}</p>
                    <p>📍 {b.address?.city}</p>
                    {b.totalAmount > 0 && <p>💰 ₹{b.totalAmount}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
