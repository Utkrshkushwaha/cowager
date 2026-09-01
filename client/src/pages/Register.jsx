import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const categories = ['electrician','plumber','carpenter','painter','cleaner','driver','gardener','caregiver','technician','domestic_helper','other'];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'customer';

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', role: defaultRole,
    city: '', state: '', pincode: '',
    // Worker specific
    category: 'electrician', hourlyRate: '', experience: '', skills: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name, email: form.email, password: form.password,
        phone: form.phone, role: form.role,
        address: { city: form.city, state: form.state, pincode: form.pincode }
      };
      if (form.role === 'worker') {
        payload.category = form.category;
        payload.hourlyRate = Number(form.hourlyRate);
        payload.experience = Number(form.experience);
        payload.skills = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      const user = await register(payload);
      toast.success(`Account created! Welcome, ${user.name}`);
      if (user.role === 'worker') navigate('/worker/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => ({ value: form[field], onChange: e => setForm({ ...form, [field]: e.target.value }) });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-gray-900">Co<span className="text-primary-600">Wager</span></span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Create your account</h1>
        </div>

        {/* Role Selector */}
        <div className="flex gap-3 mb-6">
          {['customer', 'worker'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 py-3 rounded-lg border-2 font-medium text-sm capitalize transition-all ${
                form.role === r
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {r === 'customer' ? '🏠 Customer' : '🔧 Service Worker'}
            </button>
          ))}
        </div>

        <div className="card shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required className="input-field" placeholder="Your full name" {...f('name')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required className="input-field" placeholder="you@example.com" {...f('email')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" required className="input-field" placeholder="9876543210" {...f('phone')} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" required minLength={6} className="input-field" placeholder="Min 6 characters" {...f('password')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" className="input-field" placeholder="Mumbai" {...f('city')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" className="input-field" placeholder="Maharashtra" {...f('state')} />
              </div>
            </div>

            {/* Worker-specific fields */}
            {form.role === 'worker' && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700">Worker Details</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
                  <select className="input-field" {...f('category')}>
                    {categories.map(c => (
                      <option key={c} value={c}>{c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹)</label>
                    <input type="number" required className="input-field" placeholder="300" {...f('hourlyRate')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (yrs)</label>
                    <input type="number" className="input-field" placeholder="2" {...f('experience')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                  <input type="text" className="input-field" placeholder="Wiring, Switch repair, Fan installation" {...f('skills')} />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
