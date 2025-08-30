// src/components/Footer.jsx
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Subscribed!");
  };

  const bgColor = theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const inputBg = theme === "dark" ? "bg-gray-800 text-gray-200 border-gray-600 placeholder-gray-400" : "bg-white text-gray-800 border-gray-300 placeholder-gray-500";

  return (
    <footer className={`${bgColor} border-t ${borderColor}`}>
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center mb-4">
            <img
              src="https://i.ibb.co/kVSHzqyf/Blue-and-Red-Travel-Tours-Agency-Logo.png"
              alt="TravelCo Logo"
              className="h-10 mr-2"
            />
            <span className="text-xl font-bold">TravelCo</span>
          </div>
          <p className="text-sm leading-relaxed">
            Discover unforgettable journeys and experiences with TravelCo — your global travel companion.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/" className="hover:text-blue-600 transition">Home</NavLink></li>
            <li><NavLink to="/all-packages" className="hover:text-blue-600 transition">Packages</NavLink></li>
            <li><NavLink to="/about" className="hover:text-blue-600 transition">About Us</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-blue-600 transition">Contact</NavLink></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</NavLink></li>
            <li><NavLink to="/terms" className="hover:text-blue-600 transition">Terms & Conditions</NavLink></li>
            <li><NavLink to="/faq" className="hover:text-blue-600 transition">FAQ</NavLink></li>
            <li><NavLink to="/support" className="hover:text-blue-600 transition">Support</NavLink></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Subscribe</h4>
          <p className="text-sm mb-3">Get updates on deals, tips & more.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="Your email"
              className={`px-4 py-2 text-sm rounded w-full sm:flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg}`}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className={`border-t ${borderColor} pt-6 pb-4 text-sm text-center`}>
        <div className="mb-3 flex justify-center gap-4 text-lg">
          <a href="#" aria-label="Facebook" className="hover:text-blue-600"><FaFacebookF /></a>
          <a href="#" aria-label="Twitter" className="hover:text-blue-400"><FaTwitter /></a>
          <a href="#" aria-label="Instagram" className="hover:text-pink-500"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-700"><FaLinkedinIn /></a>
        </div>
        <p>© {new Date().getFullYear()} TravelCo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
