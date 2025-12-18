import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MapPage from './components/MapPage';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import AddProductForm from './components/AddProductForm';
import InnovationPage from './components/InnovationPage';
import ArticlesPage from './components/ArticlesPage';
import AdminArticles from './components/AdminArticles';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import banner from './image/banner.jpg';
import map from './image/map.jpeg';
import swadeshi from './image/swadeshi.jpeg';
import knowledge from './image/knowledge.png';
import innovation from './image/innovation.jpeg';
import Profile from './components/Profile';
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
              <Route path="/products/add" element={<AddProductForm />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:productId" element={<ProductDetailPage />} />
              <Route path="/innovations" element={<InnovationPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/Profile" element={<Profile />} />
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

  return (
    <div className="min-h-screen bg-[#f7f2e8] pt-10 px-6">

      {/* ---------- Heading Section (Matches Screenshot) ---------- */}
      <div className="w-full rounded-xl overflow-hidden shadow-lg mb-8">
          <img
            src={banner}
            alt="India Heritage"
            className="w-full h-56 object-cover "
          />
        </div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-[#8c4b21] mb-3">
          Bharat Connect
        </h1>
        <p className="text-lg text-[#b07b4e]">
          Discover India's culture • heritage • innovations
        </p>
        <div className="w-20 h-1 bg-[#c57a31] mx-auto mt-4 rounded-full"></div>
      </div>

      {/* ---------- Feature Cards Grid ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

        {/* ----- Card 1 ----- */}
        <Link
  to="/map"
  className="group relative bg-white border border-[#eddcc7] hover:border-[#d9b28c]/70 
             shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 
             cursor-pointer text-center overflow-hidden"
>
  {/* Subtle gradient hover overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#f6e7d6] 
                  opacity-0 group-hover:opacity-60 transition-all duration-300 rounded-2xl"></div>

  {/* Image */}
  <img
    src={map}
    alt="Map"
    className="rounded-xl w-full h-40 mx-auto mb-4 object-cover 
               transform group-hover:scale-105 transition-all duration-300"
  />

  {/* Title */}
  <h3 className="text-xl font-semibold text-[#623b22] mb-2 group-hover:text-[#4a2e18] transition">
    Interactive Map
  </h3>

  {/* Description */}
  <p className="text-gray-600 group-hover:text-gray-700 transition">
    Explore states & their unique cultural identity
  </p>

  {/* Bottom accent bar */}
  <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#d9b28c] 
                  group-hover:w-full transition-all duration-300 rounded-xl"></div>
</Link>

 {/* ----- Card 2 ----- */}
     <Link
  to="/products"
  className="group relative bg-white border border-[#eddcc7] hover:border-[#d9b28c]/70 
             shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 
             cursor-pointer text-center overflow-hidden"
>
  {/* Subtle gradient hover overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#f6e7d6] 
                  opacity-0 group-hover:opacity-60 transition-all duration-300 rounded-2xl"></div>

  {/* Image */}
  <img
    src={swadeshi}
    alt="Products"
    className="rounded-xl w-full h-40 mx-auto mb-4 object-cover 
               transform group-hover:scale-105 transition-all duration-300"
  />

  {/* Title */}
  <h3 className="text-xl font-semibold text-[#623b22] mb-2 group-hover:text-[#4a2e18] transition">
    Swadeshi Products
  </h3>

  {/* Description */}
  <p className="text-gray-600 group-hover:text-gray-700 transition">
    Discover authentic Indian handicrafts
  </p>

  {/* Bottom accent bar */}
  <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#d9b28c] 
                  group-hover:w-full transition-all duration-300 rounded-xl"></div>
</Link>


  {/* ----- Card 3 ----- */}
              <Link
  to="/innovations"
  className="group relative bg-white border border-[#eddcc7] hover:border-[#d9b28c]/70 
             shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 
             cursor-pointer text-center overflow-hidden"
>
  {/* Subtle gradient hover overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#f6e7d6] 
                  opacity-0 group-hover:opacity-60 transition-all duration-300 rounded-2xl"></div>

  {/* Image */}
  <img
    src={innovation}
    alt="Innovations"
    className="rounded-xl w-full h-40 mx-auto mb-4 object-cover 
               transform group-hover:scale-105 transition-all duration-300"
  />

  {/* Title */}
  <h3 className="text-xl font-semibold text-[#623b22] mb-2 group-hover:text-[#4a2e18] transition">
    Community Innovations
  </h3>

  {/* Description */}
  <p className="text-gray-600 group-hover:text-gray-700 transition">
    Share and vote on ideas from the community
  </p>

  {/* Bottom accent bar */}
  <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#d9b28c] 
                  group-hover:w-full transition-all duration-300 rounded-xl"></div>
</Link>

        {/* ----- Card 4 ----- */}
        <Link
  to="/articles"
  className="group relative bg-white border border-[#eddcc7] hover:border-[#d9b28c]/70 
             shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 
             cursor-pointer text-center overflow-hidden"
>
  {/* Subtle gradient hover overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#f6e7d6] 
                  opacity-0 group-hover:opacity-60 transition-all duration-300 rounded-2xl"></div>

  {/* Image */}
  <img
    src={knowledge}
    alt="Knowledge Hub"
    className="rounded-xl w-full h-40 mx-auto mb-4 object-cover
               transform group-hover:scale-105 transition-all duration-300"
  />

  {/* Title */}
  <h3 className="text-xl font-semibold text-[#623b22] mb-2 group-hover:text-[#4a2e18] transition">
    Knowledge Hub
  </h3>

  {/* Description */}
  <p className="text-gray-600 group-hover:text-gray-700 transition">
    Read articles about Indian culture & heritage
  </p>

  {/* Bottom accent bar */}
  <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#d9b28c] 
                  group-hover:w-full transition-all duration-300 rounded-xl"></div>
</Link>

      </div>

      {/* ---------- Community Join Section (Matches Screenshot) ---------- */}
 {/* ---------- Community Join Section ---------- */}
<div
  className="bg-white border border-[#eddcc7] shadow-md rounded-xl p-10 
  max-w-6xl mx-auto mt-14 text-center"
>
  {!user ? (
    <>
      <h2 className="text-2xl font-semibold text-[#623b22] mb-3">
        Join the Bharat Connect Community
      </h2>
      <p className="text-gray-600 mb-6">
        Save favourites, share innovations, read and publish articles.
      </p>

      <div className="flex justify-center gap-4">
        <Link
          to="/register"
          className="bg-[#b35a17] text-white px-6 py-2 rounded-lg hover:bg-[#9a4d14] transition"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="bg-[#354155] text-white px-6 py-2 rounded-lg hover:bg-[#2b3545] transition"
        >
          Sign In
        </Link>
      </div>
    </>
  ) : (
    <>
      <h2 className="text-2xl font-semibold text-[#623b22] mb-3">
        Welcome back, {user?.name || "Explorer"}! 👋
      </h2>
      <p className="text-gray-600 mb-6">
        Continue exploring culture, innovations, and community updates.
      </p>

      <div className="flex justify-center gap-4">
        <Link
          to="/profile"
          className="bg-[#b35a17] text-white px-6 py-2 rounded-lg hover:bg-[#9a4d14] transition"
        >
          Go to Profile
        </Link>

        {user.role === "admin" && (
          <Link
            to="/admin"
            className="bg-[#354155] text-white px-6 py-2 rounded-lg hover:bg-[#2b3545] transition"
          >
            Admin Dashboard
          </Link>
        )}
      </div>
    </>
  )}
</div>

    </div>
  );
}





export default App;