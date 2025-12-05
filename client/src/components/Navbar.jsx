import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleAuthAction = async () => {
    if (user) {
      // Logout
      const result = await logout();
      if (result.success) {
        toast.success('Logged out successfully');
      } else {
        toast.error(result.error || 'Logout failed');
      }
    } else {
      // Redirect to login (React Router will handle this)
      window.location.href = '/login';
    }
  };
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
            Discover Bharat
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link to="/map" className="hover:text-blue-200 transition-colors">
              Map
            </Link>
            <Link to="/products" className="hover:text-blue-200 transition-colors">
              Products
            </Link>
            <Link to="/innovations" className="hover:text-blue-200 transition-colors">
              Innovations
            </Link>
            <Link to="/articles" className="hover:text-blue-200 transition-colors">
              Articles
            </Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="hover:text-yellow-300 transition-colors bg-yellow-600 px-2 py-1 rounded">
                Admin
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span>Welcome, {user.name}</span>
                {user.role === 'admin' && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Admin</span>
                )}
              </div>
            )}
            <button
              onClick={handleAuthAction}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              {user ? 'Logout' : 'Login'}
            </button>
          </div>

          {/* Mobile Menu Button (placeholder for future mobile menu) */}
          <div className="md:hidden">
            <button className="text-white hover:text-blue-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
