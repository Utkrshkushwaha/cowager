import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const BookService = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedService = searchParams.get('service');
  // preselectedWorker reserved for future worker-specific booking
  // const preselectedWorker = searchParams.get('worker');

  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceId: preselectedService || '',
    scheduledDate: '',
    scheduledTime: '',
    street: '', city: '', state: '', pincode: '',
    problemDescription: '',
    bookingType: 'scheduled',
    estimatedDuration: 1
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/services').then(res => setServices(res.data)).catch(() => {});
    // Pre-fill address from user profile
    if (user?.address) {
      setForm(f => ({ ...f, city: user.address.city || '', state: user.address.state || '', pincode: user.address.pincode || '' }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book a service'); navigate('/login'); return; }
    setLoading(true);
    try {
      const payload = {
        serviceId: form.serviceId,
        scheduledDate: form.scheduledDate,
        scheduledTime: form.scheduledTime,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
        problemDescription: form.problemDescription,
        bookingType: form.bookingType,
        estimatedDuration: Number(form.estimatedDuration)
      };
      const _res = await API.post('/bookings', payload);
      toast.success('Booking placed successfully!');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => ({ value: form[field], onChange: e => setForm({ ...form, [field]: e.target.value }) });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Service</h1>
      <p className="text-gray-500 mb-8">Fill in the details and a verified cooperative worker will be assigned</p>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
            <select required className="input-field" {...f('serviceId')}>
              <option value="">Select a service</option>
              {services.map(s => (
                <option key={s._id} value={s._id}>{s.name} — ₹{s.basePrice}/{s.priceType === 'hourly' ? 'hr' : 'fixed'}</option>
              ))}
            </select>
          </div>

          {/* Booking Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
            <div className="flex gap-3">
              {['scheduled', 'emergency'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, bookingType: type })}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                    form.bookingType === type ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  {type === 'scheduled' ? '📅 Scheduled' : '🚨 Emergency'}
                </button>
              ))}
            </div>
            {form.bookingType === 'emergency' && (
              <p className="text-xs text-orange-600 mt-1">Emergency bookings may have a higher service charge.</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" required min={minDate} className="input-field" {...f('scheduledDate')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
              <input type="time" required className="input-field" {...f('scheduledTime')} />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration (hours)</label>
            <select className="input-field" {...f('estimatedDuration')}>
              {[1,2,3,4,5,6,8].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>)}
            </select>
          </div>

          {/* Address */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Service Address</p>
            <input type="text" required placeholder="Street / House No." className="input-field" {...f('street')} />
            <div className="grid grid-cols-3 gap-3">
              <input type="text" required placeholder="City" className="input-field" {...f('city')} />
              <input type="text" required placeholder="State" className="input-field" {...f('state')} />
              <input type="text" required placeholder="Pincode" className="input-field" {...f('pincode')} />
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Describe the Problem</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              placeholder="Briefly describe the issue you need help with..."
              {...f('problemDescription')}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Placing Booking...' : '📅 Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookService;
