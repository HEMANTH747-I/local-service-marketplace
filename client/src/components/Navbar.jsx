import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'customer') return '/dashboard/customer';
    if (user?.role === 'provider') return '/dashboard/provider';
    if (user?.role === 'admin') return '/dashboard/admin';
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold">
        🔧 ServiceHub
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">Home</Link>

        {user ? (
          <>
            <Link to={getDashboardLink()} className="hover:underline">
              Dashboard
            </Link>
            <span className="text-sm bg-blue-800 px-3 py-1 rounded-full">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-1 rounded-full font-semibold hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-4 py-1 rounded-full font-semibold hover:bg-gray-100"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}