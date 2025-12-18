import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AddProductForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stateOfOrigin: '',
    imageUrl: ''
  });
  const [states, setStates] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch states for dropdown
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.stateOfOrigin) {
      newErrors.stateOfOrigin = 'Please select a state';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare data with defaults for required fields
      const productData = {
        ...formData,
        category: 'Handicraft', // Default category
        link: formData.imageUrl || 'https://example.com', // Use image URL as link if provided, otherwise default
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image' // Default placeholder
      };

      await api.post('/api/products', productData);

      // Redirect to products page on success
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      setErrors({ submit: 'Failed to create product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8c4b21] mb-4">Add New Product</h1>
          <div className="w-28 h-1 bg-[#d9b28c] mx-auto rounded-full"></div>
        </div>

        {/* Form */}
        <div className="bg-white border border-[#eadfcf] rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-[#623b22] mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-[#fdf8f2] shadow-sm focus:ring-2 focus:ring-[#b35a17] outline-none ${
                  errors.name ? 'border-red-500' : 'border-[#d8c3a5]'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#623b22] mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg bg-[#fdf8f2] shadow-sm focus:ring-2 focus:ring-[#b35a17] outline-none ${
                  errors.description ? 'border-red-500' : 'border-[#d8c3a5]'
                }`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-[#623b22] mb-2">
                Product Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#d8c3a5] rounded-lg bg-[#fdf8f2]
                           shadow-sm focus:ring-2 focus:ring-[#b35a17] outline-none"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-600 mt-1">Optional: Enter URL of product image</p>
            </div>

            {/* State Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-[#623b22] mb-2">
                State of Origin *
              </label>
              <select
                name="stateOfOrigin"
                value={formData.stateOfOrigin}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-[#fdf8f2] shadow-sm focus:ring-2 focus:ring-[#b35a17] outline-none ${
                  errors.stateOfOrigin ? 'border-red-500' : 'border-[#d8c3a5]'
                }`}
              >
                <option value="">Select a state</option>
                {states.map(state => (
                  <option key={state._id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.stateOfOrigin && (
                <p className="text-red-500 text-sm mt-1">{errors.stateOfOrigin}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#b35a17] text-white py-3 px-6 rounded-lg shadow hover:bg-[#9a4d14] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Product...' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="flex-1 bg-[#354155] text-white py-3 px-6 rounded-lg shadow hover:bg-[#2b3545] transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
