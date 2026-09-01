import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const Review = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    API.get(`/bookings/${bookingId}`)
      .then(res => {
        const b = res.data;
        if (b.status !== 'completed') {
          toast.error('You can only review completed bookings');
          navigate('/bookings');
          return;
        }
        setBooking(b);
      })
      .catch(() => {
        toast.error('Booking not found');
        navigate('/bookings');
      })
      .finally(() => setLoading(false));
  }, [bookingId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a star rating'); return; }
    setSubmitting(true);
    try {
      await API.post('/reviews', { bookingId, rating, comment });
      toast.success('Review submitted! Thank you.');
      navigate('/bookings');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review';
      if (msg.toLowerCase().includes('already')) {
        setAlreadyReviewed(true);
        toast.info('You have already reviewed this booking');
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (alreadyReviewed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">✅</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Already Reviewed</h2>
        <p className="text-gray-500 mb-6">You have already submitted a review for this booking.</p>
        <button onClick={() => navigate('/bookings')} className="btn-primary">Back to Bookings</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave a Review</h1>
      <p className="text-gray-500 mb-8">Share your experience to help others</p>

      {/* Booking Summary */}
      {booking && (
        <div className="card mb-6 bg-gray-50 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">Booking Summary</p>
          <div className="text-sm text-gray-600 space-y-1">
            <p>🔧 <span className="font-medium">{booking.service?.name}</span></p>
            <p>📅 {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}</p>
            {booking.worker?.user && (
              <p>👷 Worker: <span className="font-medium">{booking.worker.user.name}</span></p>
            )}
            {booking.totalAmount > 0 && <p>💰 Amount Paid: ₹{booking.totalAmount}</p>}
          </div>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <svg
                    className={`w-10 h-10 transition-colors duration-150 ${
                      star <= (hovered || rating) ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]} — {rating}/5
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Comment <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={4}
              className="input-field resize-none"
              placeholder="Describe your experience with the worker..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/bookings')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="btn-primary flex-1"
            >
              {submitting ? 'Submitting...' : '⭐ Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Review;
