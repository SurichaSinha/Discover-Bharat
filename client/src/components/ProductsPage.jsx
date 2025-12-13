import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from './ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        const productsData = response.data;

        setProducts(productsData);
        setFilteredProducts(productsData);

        setCategories([...new Set(productsData.map(p => p.category))]);
        setStates([...new Set(productsData.map(p => p.stateOfOrigin))]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (categoryFilter) filtered = filtered.filter(p => p.category === categoryFilter);
    if (stateFilter) filtered = filtered.filter(p => p.stateOfOrigin === stateFilter);

    setFilteredProducts(filtered);
  }, [products, categoryFilter, stateFilter]);

  const clearFilters = () => {
    setCategoryFilter('');
    setStateFilter('');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-xl text-gray-600">
        Loading products...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center text-[#8c4b21] mb-10">
        Swadeshi Products
      </h1>
      <div className="w-28 h-1 bg-[#d9b28c] mx-auto mb-10 rounded-full"></div>

      {/* Filter Box */}
      <div className="bg-white border border-[#eadfcf] rounded-xl shadow-md p-8 mb-10">
        <h2 className="text-xl font-semibold text-[#623b22] mb-4">Filter Products</h2>

        <div className="flex flex-col md:flex-row gap-6">

          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#623b22] mb-1">
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-[#d8c3a5] rounded-lg bg-[#fdf8f2]
                         shadow-sm focus:ring-2 focus:ring-[#b35a17] outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#623b22] mb-1">
              Filter by State
            </label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-[#d8c3a5] rounded-lg bg-[#fdf8f2]
                         shadow-sm focus:ring-2 focus:ring-[#b35a17] outline-none"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="px-5 py-2 bg-[#354155] text-white rounded-lg shadow 
                       hover:bg-[#2b3545] transition h-fit"
          >
            Clear Filters
          </button>
        </div>

        {/* Showing Count */}
        <div className="mt-4 text-sm text-gray-700">
          Showing <span className="font-semibold">{filteredProducts.length}</span> of {products.length} products
          {(categoryFilter || stateFilter) && (
            <span className="ml-2 text-[#623b22] font-medium">
              {categoryFilter && `• Category: ${categoryFilter}`}
              {stateFilter && ` • State: ${stateFilter}`}
            </span>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg mb-4">No products found.</p>
          <button
            onClick={clearFilters}
            className="px-5 py-2 bg-[#b35a17] text-white rounded-lg shadow hover:bg-[#9a4d14] transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
