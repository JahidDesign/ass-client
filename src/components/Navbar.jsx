// src/components/Navbar.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { FaBars, FaTimes, FaSun, FaMoon, FaChevronDown, FaSearch, FaUser, FaSignOutAlt, FaBookmark } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { auth } from "../firebase";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [packageDropdownOpen, setPackageDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [flights, setFlights] = useState([]);

  const avatarRef = useRef(null);
  const packageRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch data for search
  useEffect(() => {
    fetch("https://ass-server-1.onrender.com/customers").then(res => res.json()).then(setCustomers).catch(console.error);
    fetch("https://ass-server-1.onrender.com/hotels").then(res => res.json()).then(setHotels).catch(console.error);
    fetch("https://ass-server-1.onrender.com/tours").then(res => res.json()).then(setTours).catch(console.error);
    fetch("https://ass-server-1.onrender.com/flights").then(res => res.json()).then(setFlights).catch(console.error);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setDrawerOpen(false);
    setPackageDropdownOpen(false);
    setSearchResults([]);
    setSearchFocused(false);
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (packageRef.current && !packageRef.current.contains(e.target)) {
        setPackageDropdownOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // Handle search filtering per current page
  useEffect(() => {
    if (!searchQuery) return setSearchResults([]);
    const q = searchQuery.toLowerCase();
    let results = [];

    if (location.pathname.includes("customer")) {
      results = customers
        .filter(c => c.fullName?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q))
        .map(c => ({ type: "Customer", data: c }));
    } else if (location.pathname.includes("hotel")) {
      results = hotels
        .filter(h => h.hotelName?.toLowerCase().includes(q) || h.hotelLocation?.toLowerCase().includes(q))
        .map(h => ({ type: "Hotel", data: h }));
    } else if (location.pathname.includes("tour")) {
      results = tours
        .filter(t => t.selectedPackage?.toLowerCase().includes(q) || t.pickupLocation?.toLowerCase().includes(q))
        .map(t => ({ type: "Tour", data: t }));
    } else if (location.pathname.includes("flight")) {
      results = flights
        .filter(f => f.passengerName?.toLowerCase().includes(q) || f.email?.toLowerCase().includes(q))
        .map(f => ({ type: "Flight", data: f }));
    } else {
      results = [
        ...customers.filter(c => c.fullName?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)).map(c => ({ type: "Customer", data: c })),
        ...hotels.filter(h => h.hotelName?.toLowerCase().includes(q) || h.hotelLocation?.toLowerCase().includes(q)).map(h => ({ type: "Hotel", data: h })),
        ...tours.filter(t => t.selectedPackage?.toLowerCase().includes(q) || t.pickupLocation?.toLowerCase().includes(q)).map(t => ({ type: "Tour", data: t })),
        ...flights.filter(f => f.passengerName?.toLowerCase().includes(q) || f.email?.toLowerCase().includes(q)).map(f => ({ type: "Flight", data: f })),
      ];
    }

    setSearchResults(results.slice(0, 8));
  }, [searchQuery, customers, hotels, tours, flights, location.pathname]);

  // Navigate on search click
  const handleClickResult = (result) => {
    switch (result.type) {
      case "Customer": navigate(`/customer/${result.data._id}`); break;
      case "Hotel": navigate(`/hotel/${result.data._id}`); break;
      case "Tour": navigate(`/tour/${result.data._id}`); break;
      case "Flight": navigate(`/flight/${result.data._id}`); break;
      default: break;
    }
    setSearchQuery("");
    setSearchResults([]);
    setDrawerOpen(false);
    setSearchFocused(false);
  };

  // Handle protected links
  const handleProtectedClick = (path) => {
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to access this feature",
        icon: "warning",
        confirmButtonColor: "#3B82F6",
        confirmButtonText: "Login Now"
      });
      navigate("/login");
      return;
    }
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      theme === "dark" ? "bg-gray-900 border-b border-gray-700" : "bg-white border-b border-gray-200"
    }`}>
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="https://i.ibb.co/1yLywn8/Blue-and-White-Modern-Travel-Agency-Logo-300-x-92-px.png" 
            alt="Travel Agency" 
            className="h-10 w-auto object-contain" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          
          <button 
            onClick={() => handleProtectedClick("/all-packages")}
            className="hover:text-blue-600 transition-colors"
          >
            All Packages
          </button>

          {/* Package Dropdown */}
          <div className="relative" ref={packageRef}>
            <button
              onClick={() => {
                if (!user) return handleProtectedClick("/login");
                setPackageDropdownOpen(!packageDropdownOpen);
              }}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              Add Package <FaChevronDown size={12} />
            </button>
            
            {packageDropdownOpen && user && (
              <div className={`absolute top-full mt-2 w-48 rounded-lg shadow-lg border ${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}>
                <button
                  onClick={() => handleProtectedClick("/add-package")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Add Hotel
                </button>
                <button
                  onClick={() => handleProtectedClick("/TourBooking")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Add Tour
                </button>
                <button
                  onClick={() => handleProtectedClick("/add-air-packages")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Add Flight
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleProtectedClick("/manage-my-packages")}
            className="hover:text-blue-600 transition-colors"
          >
            Manage Packages
          </button>
          
          <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
          
          <button 
            onClick={() => handleProtectedClick("/myallbookings")}
            className="hover:text-blue-600 transition-colors"
          >
            My Bookings
          </button>
          
          <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className={`relative rounded-lg border ${
              theme === "dark" ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-gray-50"
            }`}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-64 pl-10 pr-4 py-2 bg-transparent outline-none"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className={`absolute mt-1 w-full max-h-64 overflow-y-auto rounded-lg shadow-lg border z-50 ${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}>
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleClickResult(result)}
                    className="flex items-center px-3 py-2 gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <img
                      src={result.data.photoUrl || result.data.customerPhoto || "/default-avatar.png"}
                      alt=""
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {result.type === "Customer" ? result.data.fullName : 
                         result.type === "Hotel" ? result.data.hotelName : 
                         result.type === "Tour" ? result.data.selectedPackage : 
                         result.data.passengerName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{result.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>

          {/* User Profile or Login */}
          {user ? (
            <div className="relative" ref={avatarRef}>
              <img
                onClick={() => setDropdownOpen(!dropdownOpen)}
                src={user.photoURL || "/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer object-cover border-2 border-blue-500"
              />

              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border ${
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}>
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-sm">{user.displayName || "User"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleProtectedClick("/profile")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaUser size={12} /> Profile
                  </button>
                  <button
                    onClick={() => handleProtectedClick("/my-bookings")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaBookmark size={12} /> My Bookings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <FaSignOutAlt size={12} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          {drawerOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Simple Mobile Drawer */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className={`fixed top-0 right-0 h-full w-80 max-w-full shadow-xl z-50 lg:hidden ${
            theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}>
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border outline-none ${
                    theme === "dark" 
                      ? "bg-gray-800 border-gray-600 text-white" 
                      : "bg-gray-50 border-gray-300"
                  }`}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Mobile Search Results */}
              {searchResults.length > 0 && (
                <div className={`mt-2 max-h-48 overflow-y-auto rounded-lg border ${
                  theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-300"
                }`}>
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleClickResult(result)}
                      className="flex items-center px-3 py-2 gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b last:border-b-0 border-gray-200 dark:border-gray-600"
                    >
                      <img
                        src={result.data.photoUrl || result.data.customerPhoto || "/default-avatar.png"}
                        alt=""
                        className="w-6 h-6 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">
                          {result.type === "Customer" ? result.data.fullName : 
                           result.type === "Hotel" ? result.data.hotelName : 
                           result.type === "Tour" ? result.data.selectedPackage : 
                           result.data.passengerName}
                        </p>
                        <p className="text-xs text-gray-500">{result.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setDrawerOpen(false)}
                  className={`block px-3 py-3 rounded-lg transition-colors ${
                    location.pathname === "/" 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  Home
                </Link>

                <button
                  onClick={() => handleProtectedClick("/all-packages")}
                  className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  All Packages
                </button>

                <button
                  onClick={() => handleProtectedClick("/add-package")}
                  className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Add Hotel
                </button>

                <button
                  onClick={() => handleProtectedClick("/TourBooking")}
                  className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Add Tour
                </button>

                <button
                  onClick={() => handleProtectedClick("/add-air-packages")}
                  className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Add Flight
                </button>

                <button
                  onClick={() => handleProtectedClick("/manage-my-packages")}
                  className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Manage Packages
                </button>

                <Link
                  to="/about"
                  onClick={() => setDrawerOpen(false)}
                  className={`block px-3 py-3 rounded-lg transition-colors ${
                    location.pathname === "/about" 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  About
                </Link>

                <button
                  onClick={() => handleProtectedClick("/myallbookings")}
                  className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  My Bookings
                </button>

                <Link
                  to="/contact"
                  onClick={() => setDrawerOpen(false)}
                  className={`block px-3 py-3 rounded-lg transition-colors ${
                    location.pathname === "/contact" 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  Contact
                </Link>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  {theme === "dark" ? <FaSun size={14} /> : <FaMoon size={14} />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>

                {/* User Profile Links (if logged in) */}
                {user && (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-3 pt-3">
                      <button
                        onClick={() => handleProtectedClick("/profile")}
                        className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <FaUser size={14} /> Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                      >
                        <FaSignOutAlt size={14} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* User Info Footer */}
            {user ? (
              <div className={`p-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.displayName || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                <Link
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full block text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;