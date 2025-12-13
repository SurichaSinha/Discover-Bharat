import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaFacebook, FaGithub } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2f2c28] text-white py-10 mt-16 border-t border-[#d8c3a5]/20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 gap-6">

          {/* Branding */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-semibold text-[#e8d3b0]">Discover Bharat</h3>
            <p className="text-gray-400 text-sm mt-2 max-w-xs">
              Celebrating India's culture, heritage, and innovations.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex gap-10 text-sm">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[#e8d3b0] font-medium mb-1">Explore</p>
              <Link to="/map" className="text-gray-400 hover:text-[#e8d3b0] transition block">Interactive Map</Link>
              <Link to="/products" className="text-gray-400 hover:text-[#e8d3b0] transition block">Swadeshi Products</Link>
              <Link to="/innovations" className="text-gray-400 hover:text-[#e8d3b0] transition block">Innovations</Link>
              <Link to="/articles" className="text-gray-400 hover:text-[#e8d3b0] transition block">Articles</Link>
            </div>

            <div className="space-y-2 text-center md:text-left">
              <p className="text-[#e8d3b0] font-medium mb-1">Support</p>
              <Link to="/about" className="text-gray-400 hover:text-[#e8d3b0] transition block">About</Link>
              <Link to="/contact" className="text-gray-400 hover:text-[#e8d3b0] transition block">Contact</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-[#e8d3b0] transition block">Privacy Policy</Link>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 text-xl justify-center">
            <a href="#" className="text-gray-400 hover:text-[#e8d3b0] transition">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#e8d3b0] transition">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#e8d3b0] transition">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#e8d3b0] transition">
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Discover Bharat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
