import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AddVendorForm from './AddVendorForm';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleBackClick = () => {
    navigate('/products');
  };

  const handleExternalLink = () => {
    if (product?.link) {
      window.open(product.link, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="text-xl text-gray-600">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-[#623b22] mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackClick}
            className="px-6 py-2 bg-[#b35a17] text-white rounded-lg shadow hover:bg-[#9a4d14] transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="mb-6 px-4 py-2 bg-[#354155] text-white rounded-lg shadow hover:bg-[#2b3545] transition"
      >
        ← Back to Products
      </button>

      {/* Product Details */}
      <div className="bg-white rounded-2xl shadow-md border border-[#eadfcf] overflow-hidden">
        {/* Product Image */}
        {product.imageUrl && (
          <div className="h-64 md:h-80 overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
          </div>
        )}

        {/* Header */}
        <div className="bg-[#f7ede2] px-8 py-6 border-b border-[#e6d4bf]">
          <h1 className="text-3xl font-bold text-[#623b22] mb-2">
            {product.name}
          </h1>
          <p className="text-lg text-[#a15a2d] font-medium">
            {product.stateOfOrigin}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block bg-[#f3e1c4] text-[#8c4b21] text-sm px-4 py-2 rounded-full font-semibold shadow-sm">
              {product.category}
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#623b22] mb-3">Description</h2>
            <p className="text-gray-700 text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExternalLink}
              className="flex-1 bg-[#b35a17] text-white py-3 px-6 rounded-lg shadow hover:bg-[#9a4d14] transition font-medium"
            >
              View Product Website
            </button>
            <button
              onClick={handleBackClick}
              className="flex-1 bg-[#354155] text-white py-3 px-6 rounded-lg shadow hover:bg-[#2b3545] transition font-medium"
            >
              Browse More Products
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-[#f9f3eb] text-sm text-gray-600 text-center border-t border-[#eadfcf]">
          Added on <span className="font-medium text-[#623b22]">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Add Vendor Form */}
      <AddVendorForm />
    </div>
  );
};

export default ProductDetailPage;
