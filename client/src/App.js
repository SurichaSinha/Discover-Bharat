import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MapPage from './components/MapPage';
import ProductsPage from './components/ProductsPage';
import InnovationPage from './components/InnovationPage';
import ArticlesPage from './components/ArticlesPage';
import AdminArticles from './components/AdminArticles';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/innovations" element={<InnovationPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/articles"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminArticles />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
}

function Home() {
  const { user, loading } = useAuth();

  console.log('Home component: user state:', user);
  console.log('Home component: loading state:', loading);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">
          Discover Bharat
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to the Swadeshi portal
        </p>
        <p className="text-lg text-gray-500">
          Explore India's rich culture, heritage, and innovations
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link
          to="/map"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer block"
        >
          <div className="text-3xl text-blue-500 mb-3">🗺️</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Interactive Map</h3>
          <p className="text-gray-600">Explore states and their unique cultural heritage</p>
        </Link>

        <Link
          to="/products"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer block"
        >
          <div className="text-3xl text-green-500 mb-3">🛍️</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Swadeshi Products</h3>
          <p className="text-gray-600">Discover authentic Indian handicrafts and products</p>
        </Link>

        <Link
          to="/innovations"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer block"
        >
          <div className="text-3xl text-purple-500 mb-3">💡</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Community Innovations</h3>
          <p className="text-gray-600">Share and vote on innovative ideas from the community</p>
        </Link>

        <Link
          to="/articles"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer block"
        >
          <div className="text-3xl text-orange-500 mb-3">📝</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Knowledge Hub</h3>
          <p className="text-gray-600">Read articles about Indian culture and heritage</p>
        </Link>
      </div>

      {user && (
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            Welcome back, <span className="font-semibold text-blue-600">{user.name}</span>!
          </p>
          {user.role === 'admin' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
              <p className="text-blue-800 font-medium">Admin Access Available</p>
              <p className="text-blue-600 text-sm">Manage content and users from the admin panel</p>
            </div>
          )}
        </div>
      )}

      {!user && (
        <div className="text-center bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6">
            Sign up to bookmark states, share innovations, and contribute to our knowledge hub
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-block"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-block"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
