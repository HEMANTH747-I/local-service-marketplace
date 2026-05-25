import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, profileRes] = await Promise.all([
        API.get('/bookings/provider'),
        API.get('/providers/profile/me')
      ]);
      setBookings(bookingsRes.data);
      setProfile(profileRes.data.provider);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
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

        {/* Profile Card */}
        {profile && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome, {user?.name}! 👋
                </h1>
                <p className="text-blue-600 font-medium">{profile.category}</p>
                <p className="text-gray-500 text-sm mt-1">{profile.bio}</p>
              </div>
              {profile.is_verified ? (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  ✅ Verified Provider
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
                  ⏳ Pending Verification
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bookings */}
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Incoming Bookings
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No bookings yet!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {booking.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Customer: {booking.customer_name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      📅 {new Date(booking.scheduled_at).toLocaleDateString()}
                    </p>
                    <p className="text-blue-600 font-semibold mt-1">
                      Rs.{booking.price}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                {/* Action Buttons */}
                {booking.status === 'pending' && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => updateStatus(booking.id, 'accepted')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, 'rejected')}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {booking.status === 'accepted' && (
                  <button
                    onClick={() => updateStatus(booking.id, 'completed')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}