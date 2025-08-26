// src/components/Navbar.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [packageDropdownOpen, setPackageDropdownOpen] = useState(false);
  const [hasBookings, setHasBookings] = useState(false);

  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);
  const packageRef = useRef(null);
  const packageButtonRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        packageRef.current &&
        !packageRef.current.contains(e.target) &&
        packageButtonRef.current &&
        !packageButtonRef.current.contains(e.target)
      ) {
        setPackageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setDrawerOpen(false);
    setPackageDropdownOpen(false);
  }, [location]);

  // Fetch user bookings
  useEffect(() => {
    if (user?.email) {
      fetch(`https://ass-server-1.onrender.com/bookings?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setHasBookings(data.length > 0);
        })
        .catch((err) => console.error("Error fetching bookings:", err));
    } else {
      setHasBookings(false);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition duration-300 ${
        isScrolled
          ? "bg-white shadow border-b border-gray-200"
          : "bg-blue-100/40 backdrop-blur-md"
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <img
              src="https://i.ibb.co/1yLywn8/Blue-and-White-Modern-Travel-Agency-Logo-300-x-92-px.png"
              alt="Logo"
              className="h-10"
              draggable={false}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/all-packages" className="hover:text-blue-600">All Packages</Link>

            {user && (
              <div className="relative">
                <button
                  ref={packageButtonRef}
                  onClick={() => setPackageDropdownOpen(!packageDropdownOpen)}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Add Package{" "}
                  <FaChevronDown
                    size={12}
                    className={`${packageDropdownOpen ? "rotate-180" : ""} transition-transform`}
                  />
                </button>
                {packageDropdownOpen && (
                  <div
                    ref={packageRef}
                    className="absolute mt-2 w-44 bg-white shadow rounded text-sm text-gray-800 z-50"
                  >
                    <Link to="/add-package" className="block px-4 py-2 hover:bg-gray-100">Add Hotel</Link>
                    <Link to="/TourBooking" className="block px-4 py-2 hover:bg-gray-100">Add Tour</Link>
                    <Link to="/add-air-packages" className="block px-4 py-2 hover:bg-gray-100">Add Flight</Link>
                  </div>
                )}
              </div>
            )}

            {user && <Link to="/manage-my-packages" className="hover:text-blue-600">Manage Packages</Link>}
            <Link to="/about" className="hover:text-blue-600">About</Link>
            {user && hasBookings && <Link to="/my-toursbookings" className="hover:text-blue-600">Mybooking</Link>}
            <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          </nav>

          {/* Right Side (Avatar / Login) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <img
                  ref={avatarRef}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  src={user.photoURL || "/default-avatar.png"}
                  alt="Avatar"
                  className="h-9 w-9 rounded-full cursor-pointer border-2 border-blue-600 hover:scale-110 transition"
                />
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white shadow rounded z-50 text-sm text-gray-800"
                  >
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <Link to="/my-bookings" className="block px-4 py-2 hover:bg-gray-100">My Bookings</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="md:hidden text-gray-700"
          >
            {drawerOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Right-side drawer for mobile */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">Menu</h2>
          <button onClick={() => setDrawerOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-3 text-gray-800 text-sm">
          <Link to="/" className="block" onClick={() => setDrawerOpen(false)}>Home</Link>
          <Link to="/all-packages" className="block" onClick={() => setDrawerOpen(false)}>All Packages</Link>
          {user && (
            <>
              <Link to="/add-package" className="block" onClick={() => setDrawerOpen(false)}>Add Hotel</Link>
              <Link to="/TourBooking" className="block" onClick={() => setDrawerOpen(false)}>Add Tour</Link>
              <Link to="/add-air-packages" className="block" onClick={() => setDrawerOpen(false)}>Add Flight</Link>
              <Link to="/manage-my-packages" className="block" onClick={() => setDrawerOpen(false)}>Manage Packages</Link>
            </>
          )}
          <Link to="/about" className="block" onClick={() => setDrawerOpen(false)}>About</Link>
          {user && hasBookings && <Link to="/my-toursbookings" className="block" onClick={() => setDrawerOpen(false)}>Mybooking</Link>}
          <Link to="/contact" className="block" onClick={() => setDrawerOpen(false)}>Contact</Link>
          {user ? (
            <>
              <Link to="/profile" className="block" onClick={() => setDrawerOpen(false)}>{user.email}</Link>
              <button onClick={handleLogout} className="text-red-600 text-left">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setDrawerOpen(false)}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
