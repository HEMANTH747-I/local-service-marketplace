import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Home() {
  const [providers, setProviders] = useState([]);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    'Electrician', 'Plumber', 'Tutor',
    'Mechanic', 'Carpenter', 'Cleaner'
  ];

  const searchProviders = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/providers?category=${category}&location=${location}`);
      setProviders(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    searchProviders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Find Trusted Local Service Providers
        </h1>
        <p className="text-lg mb-8 text-blue-100">
          Electricians, Plumbers, Tutors, Mechanics & more — verified and near you!
        </p>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 justify-center max-w-2xl mx-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-lg text-gray-800 w-full"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-3 rounded-lg text-gray-800 w-full"
          />

          <button
            onClick={searchProviders}
            className="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Search
          </button>
        </div>
      </div>

      {/* Providers List */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {providers.length > 0 ? 'Available Providers' : 'No providers found'}
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map(provider => (
              <div
                key={provider.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/providers/${provider.id}`)}
              >
                {/* Verified Badge */}
                {provider.is_verified && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                    ✅ Verified
                  </span>
                )}

                <h3 className="text-xl font-bold text-gray-800 mt-2">
                  {provider.name}
                </h3>
                <p className="text-blue-600 font-medium">{provider.category}</p>
                <p className="text-gray-500 text-sm mt-1">📍 {provider.location}</p>
                <p className="text-gray-600 text-sm mt-2">{provider.bio}</p>
                <p className="text-gray-500 text-sm mt-1">
                  🏆 {provider.experience} years experience
                </p>

                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  View Profile & Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}