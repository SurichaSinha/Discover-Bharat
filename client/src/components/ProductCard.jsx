const ProductCard = ({ product }) => {
  const handleLinkClick = () => {
    if (product.link) {
      window.open(product.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md border border-[#eadfcf] overflow-hidden
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Product Header */}
      <div className="bg-[#f7ede2] px-5 py-4 border-b border-[#e6d4bf]">
        <h3 className="text-xl font-semibold text-[#623b22]">
          {product.name}
        </h3>
        <p className="text-sm text-[#a15a2d] font-medium mt-1">
          {product.stateOfOrigin}
        </p>
      </div>

      {/* Product Body */}
      <div className="p-5">
        <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
          {product.description}
        </p>

        {/* Category Badge */}
        <div className="mb-5">
          <span
            className="inline-block bg-[#f3e1c4] text-[#8c4b21] text-xs px-3 py-1 
                       rounded-full font-semibold shadow-sm"
          >
            {product.category}
          </span>
        </div>

        {/* Action Button */}
        {product.link && (
          <button
            onClick={handleLinkClick}
            className="w-full bg-[#b35a17] text-white py-2.5 rounded-lg shadow 
                       hover:bg-[#9a4d14] transition font-medium"
          >
            View Product
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-[#f9f3eb] text-xs text-gray-600 text-center border-t border-[#eadfcf]">
        Added on <span className="font-medium text-[#623b22]">
          {new Date(product.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
