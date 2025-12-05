const ProductCard = ({ product }) => {
  const handleLinkClick = () => {
    if (product.link) {
      window.open(product.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Header */}
      <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-blue-600 font-medium">
          {product.stateOfOrigin}
        </p>
      </div>

      {/* Product Content */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            {product.category}
          </span>
        </div>

        {/* Action Button */}
        {product.link && (
          <button
            onClick={handleLinkClick}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            View Product
          </button>
        )}
      </div>

      {/* Footer with timestamp */}
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 text-center">
        Added {new Date(product.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ProductCard;
