// src/components/Navbar.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaChevronDown,
  FaUser,
  FaSignOutAlt,
  FaBookmark,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { auth } from "../firebase";
import SearchBar from "./secret/SearchBar";
import NavLink from "./secret/NavLink";
import { motion, AnimatePresence } from "framer-motion";

// Animated NavLink Component
// const NavLink = ({ to, children, onClick }) => (
//   <Link to={to} onClick={onClick} className="relative inline-block group font-medium">
//     <span className="relative z-10">{children}</span>
//     <motion.span
//       className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
//       initial={{ width: 0 }}
//       whileHover={{ width: "100%" }}
//       transition={{ type: "spring", stiffness: 300, damping: 20 }}
//     />
//   </Link>
// );

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [packageDropdownOpen, setPackageDropdownOpen] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [flights, setFlights] = useState([]);

  const avatarRef = useRef(null);
  const packageRef = useRef(null);

  const packageItems = [
    { label: "Add Hotel", path: "/add-package" },
    { label: "Add Tour", path: "/TourBooking" },
    { label: "Add Flight", path: "/add-air-packages" },
  ];

  // Fetch data
  useEffect(() => {
    fetch("https://ass-server-sy-travles.onrender.com/customers")
      .then((res) => res.json())
      .then(setCustomers)
      .catch(console.error);
    fetch("https://ass-server-sy-travles.onrender.com/hotels")
      .then((res) => res.json())
      .then(setHotels)
      .catch(console.error);
    fetch("https://ass-server-sy-travles.onrender.com/tours")
      .then((res) => res.json())
      .then(setTours)
      .catch(console.error);
    fetch("https://ass-server-sy-travles.onrender.com/flights")
      .then((res) => res.json())
      .then(setFlights)
      .catch(console.error);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setDropdownOpen(false);
    setDrawerOpen(false);
    setPackageDropdownOpen(false);
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (packageRef.current && !packageRef.current.contains(e.target))
        setPackageDropdownOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleProtectedClick = (path) => {
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to access this feature",
        icon: "warning",
        confirmButtonColor: "#3B82F6",
        confirmButtonText: "Login Now",
      });
      navigate("/login");
      return;
    }
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        theme === "dark" ? "bg-gray-900 border-b border-gray-700" : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="https://i.ibb.co/1yLywn8/Blue-and-White-Modern-Travel-Agency-Logo-300-x-92-px.png"
            alt="Travel Agency"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-gray-700 dark:text-gray-200">
          <NavLink to="/">Home</NavLink>
          <button onClick={() => handleProtectedClick("/all-packages")}>
            <NavLink to="#">All Packages</NavLink>
          </button>

          {/* Add Package Dropdown */}
          <div className="relative" ref={packageRef}>
            <button
              onClick={() => {
                if (!user) return handleProtectedClick("/login");
                setPackageDropdownOpen(!packageDropdownOpen);
              }}
              className="flex items-center gap-1"
            >
              Add Package <FaChevronDown size={12} />
            </button>
            <AnimatePresence>
              {packageDropdownOpen && user && (
                <motion.div
                  className={`absolute top-full mt-2 w-48 rounded-lg shadow-lg border ${
                    theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {packageItems.map((item, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleProtectedClick(item.path)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      whileHover={{ scale: 1.03, x: 5 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/manage-my-packages">Manage Packages</NavLink>
          <NavLink to="/about">About</NavLink>
          <button onClick={() => handleProtectedClick("/myallbookings")}>
            <NavLink to="#">My Bookings</NavLink>
          </button>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-4">
          <SearchBar customers={customers} hotels={hotels} tours={tours} flights={flights} />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>

          {/* User Profile */}
          {user ? (
            <div className="relative" ref={avatarRef}>
              <img
                onClick={() => setDropdownOpen(!dropdownOpen)}
                src={user.photoURL || "/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer object-cover border-2 border-blue-500"
              />
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className={`absolute right-0 mt-2 w-52 rounded-lg shadow-lg border z-50 ${
                      theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-sm">{user.displayName || "User"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleProtectedClick("/profile")}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <FaUser size={14} /> Profile
                    </button>
                    <button
                      onClick={() => handleProtectedClick("/my-bookings")}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <FaBookmark size={14} /> My Bookings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <FaSignOutAlt size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2" onClick={() => setDrawerOpen(!drawerOpen)}>
          {drawerOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className={`fixed top-0 right-0 h-full w-80 max-w-full shadow-xl z-50 lg:hidden ${
                theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between p-4 border-b ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b">
                <SearchBar customers={customers} hotels={hotels} tours={tours} flights={flights} />
              </div>

              {/* Mobile Links */}
              <nav className="flex flex-col p-4 gap-2">
                {[
                  { label: "Home", to: "/" },
                  { label: "All Packages", to: "#", onClick: () => handleProtectedClick("/all-packages") },
                  { label: "Manage Packages", to: "/manage-my-packages" },
                  { label: "About", to: "/about" },
                  { label: "My Bookings", to: "#", onClick: () => handleProtectedClick("/myallbookings") },
                  { label: "Contact", to: "/contact" },
                ].map((item, idx) => (
                  <motion.div key={idx} whileHover={{ x: 5 }} whileTap={{ scale: 0.97 }}>
                    <NavLink
                      to={item.to}
                      onClick={() => {
                        setDrawerOpen(false);
                        if (item.onClick) item.onClick();
                      }}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}

                {/* Mobile Add Package */}
                <div className="relative mt-2">
                  <button
                    onClick={() => {
                      if (!user) return handleProtectedClick("/login");
                      setPackageDropdownOpen(!packageDropdownOpen);
                    }}
                    className="flex items-center gap-1 w-full"
                  >
                    Add Package <FaChevronDown size={12} />
                  </button>
                  <AnimatePresence>
                    {packageDropdownOpen && user && (
                      <motion.div
                        className={`flex flex-col mt-2 rounded-lg shadow-lg border ${
                          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                        }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        {packageItems.map((item, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => handleProtectedClick(item.path)}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
                            whileHover={{ scale: 1.03, x: 5 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {item.label}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="mt-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
                </button>

                {/* Mobile User Section */}
                {user ? (
                  <div className="mt-4 border-t pt-4 flex flex-col gap-2">
                    <p className="font-medium text-sm">{user.displayName || "User"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <button
                      onClick={() => handleProtectedClick("/profile")}
                      className="flex items-center gap-2 hover:text-blue-600"
                    >
                      <FaUser size={14} /> Profile
                    </button>
                    <button
                      onClick={() => handleProtectedClick("/my-bookings")}
                      className="flex items-center gap-2 hover:text-blue-600"
                    >
                      <FaBookmark size={14} /> My Bookings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-500 hover:text-red-700"
                    >
                      <FaSignOutAlt size={14} /> Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
                  >
                    Login
                  </Link>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
