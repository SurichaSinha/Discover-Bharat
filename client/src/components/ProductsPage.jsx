import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from './ProductCard';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState('');
  const [products, setProducts] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/states');
        setStates(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  // Fetch products when state is selected
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedState) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/products?state=${selectedState}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedState]);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Page Title */}
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold text-center text-[#8c4b21] mb-4">
          Swadeshi Products
        </h1>
        <div className="w-28 h-1 bg-[#d9b28c] mb-6 rounded-full"></div>
        <button
          onClick={() => navigate('/products/add')}
          className="px-6 py-2 bg-[#b35a17] text-white rounded-lg shadow hover:bg-[#9a4d14] transition font-medium"
        >
          + Add New Product
        </button>
      </div>

      {/* State Selection Dropdown */}
      <div className="bg-white border border-[#eadfcf] rounded-xl shadow-md p-8 mb-10">
        <h2 className="text-xl font-semibold text-[#623b22] mb-4">Select a State</h2>

        <div className="max-w-md">
          <label className="block text-sm font-semibold text-[#623b22] mb-1">
            Choose an Indian State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-4 py-2 border border-[#d8c3a5] rounded-lg bg-[#fdf8f2]
                       shadow-sm focus:ring-2 focus:ring-[#b35a17] outline-none"
          >
            <option value="">Select a state...</option>
            {states.map(state => (
              <option key={state._id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {selectedState && (
          <div className="mt-4 text-sm text-[#623b22] font-medium">
            Showing products from <span className="font-semibold">{selectedState}</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && selectedState && (
        <div className="text-center py-16">
          <div className="text-xl text-gray-600">Loading products...</div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && selectedState && products.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg mb-4">
            No products found for {selectedState}.
          </p>
        </div>
      )}

      {!loading && selectedState && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Initial State - No State Selected */}
      {!selectedState && (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg mb-4">
            Please select a state to view famous products.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
