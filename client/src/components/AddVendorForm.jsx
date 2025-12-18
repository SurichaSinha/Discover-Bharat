import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const AddVendorForm = () => {
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    shopName: '',
    city: '',
    contact: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact information is required';
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
      setErrors({});

      await api.post(`/api/products/${productId}/vendors`, formData);

      // Show success message and reset form
      setSuccess(true);
      setFormData({
        shopName: '',
        city: '',
        contact: ''
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error adding vendor:', error);
      setErrors({ submit: 'Failed to add vendor. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#eadfcf] rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-2xl font-semibold text-[#623b22] mb-6">Add Vendor</h2>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-600 text-sm font-medium">
            ✓ Vendor added successfully!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Shop Name */}
        <div>
          <label className="block text-sm font-semibold text-[#623b22] mb-1">
            Shop Name *
          </label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg bg-[#fdf8f2] shadow-sm focus:ring-2 focus:ring-[#b35a17] outline-none ${
              errors.shopName ? 'border-red-500' : 'border-[#d8c3a5]'
            }`}
            placeholder="Enter shop name"
          />
          {errors.shopName && (
            <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-[#623b22] mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg bg-[#fdf8f2] shadow-sm focus:ring-2 focus:ring-[#b35a17] outline-none ${
              errors.city ? 'border-red-500' : 'border-[#d8c3a5]'
            }`}
            placeholder="Enter city"
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        {/* Contact/Description */}
        <div>
          <label className="block text-sm font-semibold text-[#623b22] mb-1">
            Contact Information *
          </label>
          <textarea
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            rows="3"
            className={`w-full px-3 py-2 border rounded-lg bg-[#fdf8f2] shadow-sm focus:ring-2 focus:ring-[#b35a17] outline-none ${
              errors.contact ? 'border-red-500' : 'border-[#d8c3a5]'
            }`}
            placeholder="Enter contact details, phone number, or description"
          />
          {errors.contact && (
            <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#b35a17] text-white py-2.5 px-4 rounded-lg shadow hover:bg-[#9a4d14] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding Vendor...' : 'Add Vendor'}
        </button>
      </form>
    </div>
  );
};

export default AddVendorForm;
