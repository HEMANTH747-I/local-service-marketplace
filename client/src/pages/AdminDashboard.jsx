import { useState, useEffect } from 'react';
import API from '../services/api';

export default function AdminDashboard() {
  const [pendingProviders, setPendingProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, usersRes] = await Promise.all([
        API.get('/admin/providers/pending'),
        API.get('/admin/users')
      ]);
      setPendingProviders(pendingRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const verifyProvider = async (id) => {
    try {
      await API.put(`/admin/providers/${id}/verify`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProvider = async (id) => {
    try {
      await API.delete(`/admin/providers/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Dashboard 🛡️
          </h1>
          <p className="text-gray-500 mt-1">
            Manage providers and users
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {users.length}
            </p>
            <p className="text-gray-500 mt-1">Total Users</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {pendingProviders.length}
            </p>
            <p className="text-gray-500 mt-1">Pending Verifications</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 shadow-md'
            }`}
          >
            Pending Providers ({pendingProviders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 shadow-md'
            }`}
          >
            All Users ({users.length})
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            {/* Pending Providers Tab */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingProviders.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-gray-500">No pending verifications!</p>
                  </div>
                ) : (
                  pendingProviders.map(provider => (
                    <div key={provider.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {provider.name}
                          </h3>
                          <p className="text-blue-600">{provider.category}</p>
                          <p className="text-gray-500 text-sm">{provider.email}</p>
                          <p className="text-gray-500 text-sm">📍 {provider.location}</p>
                          <p className="text-gray-600 text-sm mt-1">{provider.bio}</p>
                          <p className="text-gray-500 text-sm">
                            Experience: {provider.experience} years
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => verifyProvider(provider.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                          >
                            ✅ Verify
                          </button>
                          <button
                            onClick={() => deleteProvider(provider.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* All Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-800">{user.name}</td>
                        <td className="px-6 py-4 text-gray-500">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : user.role === 'provider'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{user.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}