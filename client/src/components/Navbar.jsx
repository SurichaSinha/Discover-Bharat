import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useState } from 'react';


const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [openProfile, setOpenProfile] = useState(false);

  const isActive = (path) =>
    location.pathname === path
      ? "text-[#8c4b21] font-semibold border-b-2 border-[#c7772f] pb-1"
      : "text-[#754c2a] hover:text-[#8c4b21] transition";

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) toast.success("Logged out successfully");
    else toast.error(result.error || "Logout failed");
  };

  return (
    <nav className="bg-white border-b border-[#eadfcf] shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">

          {/* ---------- Brand ---------- */}
          <Link
            to="/"
            className="text-2xl font-bold text-[#8c4b21] hover:text-[#a15a2d] transition"
          >
            Bharat Connect
          </Link>

          {/* ---------- Desktop Navigation ---------- */}
          <div className="hidden md:flex space-x-8 text-lg">
            <Link to="/" className={isActive("/")}>Home</Link>
            <Link to="/map" className={isActive("/map")}>Map</Link>
            <Link to="/products" className={isActive("/products")}>Products</Link>
            <Link to="/innovations" className={isActive("/innovations")}>Innovations</Link>
            <Link to="/articles" className={isActive("/articles")}>Articles</Link>

            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="bg-[#b35a17] text-white px-3 py-1 rounded-lg shadow-sm hover:bg-[#9e4e14] transition"
              >
                Admin
              </Link>
            )}
          </div>

          {/* ---------- Profile + Auth ---------- */}
          <div className="flex items-center space-x-4 relative">

            {/* Profile Section (visible only when logged in) */}
            {user && (
              <div className="relative">
                <button
                  className="flex items-center space-x-3 bg-[#f5e9db] px-3 py-1.5 rounded-lg 
                             hover:bg-[#ecd9c2] transition"
                  onClick={() => setOpenProfile(!openProfile)}
                >
                  {/* Avatar Circle */}
                  <div className="w-9 h-9 bg-[#b35a17] text-white rounded-full flex items-center 
                                  justify-center font-semibold text-lg shadow">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>

                  {/* Name */}
                  <span className="text-[#623b22] font-medium hidden md:block">
                    {user.name || "User"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {openProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-[#eadfcf] py-2 z-50">
                    <Link
                      to="/Profile"
                      className="block px-4 py-2 text-[#754c2a] hover:bg-[#f6e7d6] transition"
                      onClick={() => setOpenProfile(false)}
                    >
                      Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-[#754c2a] hover:bg-[#f6e7d6] transition"
                      onClick={() => setOpenProfile(false)}
                    >
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-[#b35a17] font-semibold hover:bg-[#f4d9c3] transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Login Button (only when not logged in) */}
            {!user && (
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-[#b35a17] text-white px-5 py-2 rounded-lg shadow-sm 
                           hover:bg-[#9e4e14] transition font-medium"
              >
                Login
              </button>
            )}
          </div>

          {/* ---------- Mobile Menu Button ---------- */}
          <div className="md:hidden">
            <button className="text-[#754c2a] hover:text-[#8c4b21] transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
