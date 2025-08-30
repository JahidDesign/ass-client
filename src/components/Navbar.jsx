// src/components/Navbar.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { FaBars, FaTimes, FaSun, FaMoon, FaChevronDown, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { auth } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";

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
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (packageRef.current && !packageRef.current.contains(e.target)) setPackageDropdownOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchResults([]);
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
      // Default: show all types
      results = [
        ...customers.filter(c => c.fullName?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)).map(c => ({ type: "Customer", data: c })),
        ...hotels.filter(h => h.hotelName?.toLowerCase().includes(q) || h.hotelLocation?.toLowerCase().includes(q)).map(h => ({ type: "Hotel", data: h })),
        ...tours.filter(t => t.selectedPackage?.toLowerCase().includes(q) || t.pickupLocation?.toLowerCase().includes(q)).map(t => ({ type: "Tour", data: t })),
        ...flights.filter(f => f.passengerName?.toLowerCase().includes(q) || f.email?.toLowerCase().includes(q)).map(f => ({ type: "Flight", data: f })),
      ];
    }

    setSearchResults(results);
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
  };

  // Handle protected links
  const handleProtectedClick = (path) => {
    if (!user) {
      Swal.fire("Login Required", "You need to log in to access this page.", "warning");
      navigate("/login");
      return;
    }
    navigate(path);
    setDrawerOpen(false);
  };

  // Navbar styling
  const navbarBg = isScrolled
    ? theme === "dark" ? "bg-gray-900 shadow-lg" : "bg-white shadow-lg"
    : theme === "dark" ? "bg-gray-800/70 backdrop-blur-md" : "bg-white/70 backdrop-blur-md";

  const navTextColor = theme === "dark" ? "text-gray-200" : "text-gray-700";
  const dropdownBg = theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-colors ${navbarBg} border-b`}>
      <div className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="https://i.ibb.co/1yLywn8/Blue-and-White-Modern-Travel-Agency-Logo-300-x-92-px.png" alt="Logo" className="h-10 w-full object-cover" />
        </Link>

        {/* Desktop Links */}
        <nav className={`hidden md:flex items-center gap-8 ${navTextColor}`}>
          <Link to="/" className="hover:text-blue-500">Home</Link>
          <Link to="/all-packages" onClick={() => handleProtectedClick("/all-packages")} className="hover:text-blue-500">AllPackages</Link>

          {/* Package Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                if (!user) return handleProtectedClick("/login");
                setPackageDropdownOpen(!packageDropdownOpen);
              }}
              className="flex items-center gap-1 hover:text-blue-500"
            >
              AddPackage <FaChevronDown className={`${packageDropdownOpen ? "rotate-180" : ""} transition-transform`} />
            </button>
            <AnimatePresence>
              {packageDropdownOpen && user && (
                <motion.div
                  ref={packageRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full mt-2 w-44 shadow rounded z-50 ${dropdownBg}`}
                >
                  <button onClick={() => handleProtectedClick("/add-package")} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Add Hotel</button>
                  <button onClick={() => handleProtectedClick("/TourBooking")} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Add Tour</button>
                  <button onClick={() => handleProtectedClick("/add-air-packages")} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Add Flight</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => handleProtectedClick("/manage-my-packages")} className="hover:text-blue-500">ManagePackages</button>
          <Link to="/about" className="hover:text-blue-500">About</Link>
          <button onClick={() => handleProtectedClick("/myallbookings")} className="hover:text-blue-500">MyBookings</button>
          <Link to="/contact" className="hover:text-blue-500">Contact</Link>
        </nav>

        {/* Right Section: Search + Theme + Profile/Login */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            {searchResults.length > 0 && (
              <div className="absolute mt-1 w-full max-h-80 overflow-y-auto shadow-lg rounded bg-white z-50">
                {searchResults.map((r, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleClickResult(r)}
                    className="flex items-center px-4 py-2 gap-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <img src={r.data.photoUrl || r.data.customerPhoto || "/default-avatar.png"} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-sm">
                        {r.type === "Customer" ? r.data.fullName : r.type === "Hotel" ? r.data.hotelName : r.type === "Tour" ? r.data.selectedPackage : r.data.passengerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {r.type === "Customer" ? r.data.email : r.type === "Hotel" ? r.data.hotelLocation : r.type === "Tour" ? r.data.pickupLocation : r.data.email}
                      </p>
                      <span className={`text-xs ${r.type === "Customer" ? "text-blue-500" : r.type === "Hotel" ? "text-yellow-500" : r.type === "Tour" ? "text-green-500" : "text-purple-500"}`}>
                        {r.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {/* User / Login */}
          {user ? (
            <div className="relative">
              <img
                ref={avatarRef}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                src={user.photoURL || "/default-avatar.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-600"
              />
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-48 shadow rounded z-50 text-sm ${dropdownBg}`}
                  >
                    <button onClick={() => handleProtectedClick("/profile")} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</button>
                    <button onClick={() => handleProtectedClick("/my-bookings")} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">My Bookings</button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-700">Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">Login</Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setDrawerOpen(!drawerOpen)}>
          {drawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className={`fixed top-0 right-0 h-full w-64 shadow-lg z-50 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
          >
            <div className="flex flex-col p-6 gap-6">
              <Link to="/" onClick={() => setDrawerOpen(false)}>Home</Link>
              <button onClick={() => handleProtectedClick("/all-packages")}>AllPackages</button>
              <button onClick={() => handleProtectedClick("/add-package")}>Add Hotel</button>
              <button onClick={() => handleProtectedClick("/TourBooking")}>Add Tour</button>
              <button onClick={() => handleProtectedClick("/add-air-packages")}>Add Flight</button>
              <button onClick={() => handleProtectedClick("/manage-my-packages")}>ManagePackages</button>
              <Link to="/about" onClick={() => setDrawerOpen(false)}>About</Link>
              <button onClick={() => handleProtectedClick("/myallbookings")}>MyBookings</button>
              <Link to="/contact" onClick={() => setDrawerOpen(false)}>Contact</Link>

              <button onClick={toggleTheme} className="flex items-center gap-2">
                {theme === "dark" ? <FaSun /> : <FaMoon />} Theme
              </button>

              {user ? (
                <>
                  <button onClick={() => handleProtectedClick("/profile")}>Profile</button>
                  <button onClick={() => handleProtectedClick("/my-bookings")}>My Bookings</button>
                  <button onClick={handleLogout} className="text-red-500">Logout</button>
                </>
              ) : (
                <button onClick={() => handleProtectedClick("/login")}>Login</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
