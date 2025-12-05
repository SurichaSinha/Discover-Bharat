import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from './ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  // Unique categories and states for filter options
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        const productsData = response.data;
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Extract unique categories and states using Set and spread operator
        const uniqueCategories = [...new Set(productsData.map(product => product.category))];
        const uniqueStates = [...new Set(productsData.map(product => product.stateOfOrigin))];

        setCategories(uniqueCategories);
        setStates(uniqueStates);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products when filters change
  useEffect(() => {
    let filtered = products;

    // Use filter() method for category filtering
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Use filter() method for state filtering
    if (stateFilter) {
      filtered = filtered.filter(product => product.stateOfOrigin === stateFilter);
    }

    setFilteredProducts(filtered);
  }, [products, categoryFilter, stateFilter]);

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleStateChange = (e) => {
    setStateFilter(e.target.value);
  };

  const clearFilters = () => {
    setCategoryFilter('');
    setStateFilter('');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-xl text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Swadeshi Products
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by State
            </label>
            <select
              id="state"
              value={stateFilter}
              onChange={handleStateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
          {(categoryFilter || stateFilter) && (
            <span className="ml-2">
              {categoryFilter && `• Category: ${categoryFilter}`}
              {stateFilter && `• State: ${stateFilter}`}
            </span>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No products found matching your filters.</div>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
