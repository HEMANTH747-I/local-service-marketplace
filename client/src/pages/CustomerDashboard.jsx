import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({});
  const [reviewSuccess, setReviewSuccess] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleReviewChange = (bookingId, field, value) => {
    setReviewForm(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], [field]: value }
    }));
  };

  const submitReview = async (booking) => {
    const form = reviewForm[booking.id];
    if (!form?.rating || !form?.comment) {
      return alert('Please fill in rating and comment');
    }
    try {
      await API.post('/reviews', {
        provider_id: booking.provider_id,
        booking_id: booking.id,
        rating: parseInt(form.rating),
        comment: form.comment,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : []
      });
      setReviewSuccess(prev => ({ ...prev, [booking.id]: true }));
    } catch (err) {
      alert(err.response?.data?.message || 'Review failed');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'accepted') return 'bg-blue-100 text-blue-700';
    if (status === 'completed') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here are all your service bookings</p>
        </div>

        <h2 className="text-xl font-bold text-gray-700 mb-4">My Bookings</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No bookings yet!</p>
            <a href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Find a Provider
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{booking.title}</h3>
                    <p className="text-gray-500 text-sm">Provider: {booking.provider_name}</p>
                    <p className="text-gray-500 text-sm">
                      📅 {new Date(booking.scheduled_at).toLocaleDateString()}
                    </p>
                    <p className="text-blue-600 font-semibold mt-1">Rs.{booking.price}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                {/* Review Form — only for completed bookings */}
                {booking.status === 'completed' && (
                  <div className="mt-4 border-t pt-4">
                    {reviewSuccess[booking.id] ? (
                      <p className="text-green-600 font-semibold">
                        ✅ Review submitted!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700">
                          Leave a Review
                        </h4>
                        <select
                          value={reviewForm[booking.id]?.rating || ''}
                          onChange={(e) => handleReviewChange(booking.id, 'rating', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        >
                          <option value="">Select Rating</option>
                          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                          <option value="4">⭐⭐⭐⭐ Good</option>
                          <option value="3">⭐⭐⭐ Average</option>
                          <option value="2">⭐⭐ Poor</option>
                          <option value="1">⭐ Terrible</option>
                        </select>

                        <textarea
                          placeholder="Write your review..."
                          value={reviewForm[booking.id]?.comment || ''}
                          onChange={(e) => handleReviewChange(booking.id, 'comment', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24"
                        />

                        <input
                          type="text"
                          placeholder="Tags (comma separated): punctual, professional"
                          value={reviewForm[booking.id]?.tags || ''}
                          onChange={(e) => handleReviewChange(booking.id, 'tags', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />

                        <button
                          onClick={() => submitReview(booking)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Submit Review
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}