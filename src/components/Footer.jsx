import { NavLink } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // You can add API integration here (e.g., Mailchimp or Firebase)
    alert("Subscribed!");
  };

  return (
    <footer className="bg-white text-gray-800 border-t">
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
          <p className="text-sm text-gray-600 leading-relaxed">
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
          <p className="text-sm text-gray-600 mb-3">Get updates on deals, tips & more.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="Your email"
              className="px-4 py-2 text-sm border border-gray-300 rounded w-full sm:flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="border-t pt-6 pb-4 text-sm text-center text-gray-500">
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
