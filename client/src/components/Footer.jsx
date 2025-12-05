const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-400">
            © {currentYear} Discover Bharat. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Celebrating India's culture, heritage, and innovations.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
