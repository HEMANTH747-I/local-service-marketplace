import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function ProviderProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState('');

useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);

const fetchData = async () => {
  try {
    const [providersRes, reviewsRes, servicesRes] = await Promise.all([
      API.get(`/providers`),
      API.get(`/reviews/${id}`),
      API.get(`/providers/${id}/services`)
    ]);
    const found = providersRes.data.find(p => p.id === parseInt(id));
    setProvider({ ...found, services: servicesRes.data });
    setReviews(reviewsRes.data.reviews);
    setAvgRating(reviewsRes.data.average_rating);
  } catch (err) {
    console.error(err);
  }
  setLoading(false);
};

  const handleBooking = async () => {
    if (!user) return navigate('/login');
    if (!selectedService || !scheduledAt) return alert('Please select a service and date');
    setBooking(true);
    try {
      await API.post('/bookings', {
        provider_id: parseInt(id),
        service_id: selectedService,
        scheduled_at: scheduledAt
      });
      setSuccess('Booking created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
    setBooking(false);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!provider) return <p className="text-center mt-10 text-gray-500">Provider not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Provider Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              {provider.is_verified && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  ✅ Verified Provider
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-800 mt-2">
                {provider.name}
              </h1>
              <p className="text-blue-600 font-medium text-lg">{provider.category}</p>
              <p className="text-gray-500">📍 {provider.location}</p>
              <p className="text-gray-600 mt-2">{provider.bio}</p>
              <p className="text-gray-500 text-sm mt-1">
                🏆 {provider.experience} years experience
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-yellow-500">{avgRating}</p>
              <p className="text-gray-500 text-sm">⭐ Rating</p>
              <p className="text-gray-400 text-xs">{reviews.length} reviews</p>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        {user?.role === 'customer' && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Book a Service</h2>

            {success ? (
              <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg">
                {success} 🎉
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Service
                  </label>
                  <select
                    value={selectedService || ''}
                    onChange={(e) => setSelectedService(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">Choose a service...</option>
                    {provider.services?.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.title} - Rs.{service.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                <button
                  onClick={handleBooking}
                  disabled={booking}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {booking ? 'Booking...' : 'Book Now'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="border-b pb-4">
                  <div className="flex justify-between">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-500">⭐</span>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{review.comment}</p>
                  <div className="flex gap-2 mt-2">
                    {review.tags.map(tag => (
                      <span key={tag} className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}