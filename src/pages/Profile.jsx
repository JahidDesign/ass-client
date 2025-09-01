// src/pages/Profile.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { 
  FaFacebook, 
  FaLinkedin, 
  FaTwitter, 
  FaTrash, 
  FaSignOutAlt, 
  FaEdit, 
  FaPhoneAlt, 
  FaEnvelope,
  FaHotel,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaEye,
  FaDownload,
  FaShare,
  FaCog,
  FaBell,
  FaBookmark
} from "react-icons/fa";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [profileData, setProfileData] = useState({});
  const [hotelBookings, setHotelBookings] = useState([]);
  const [tourBookings, setTourBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('all'); // all, upcoming, past
  const [showSettings, setShowSettings] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    upcomingTrips: 0,
    completedTrips: 0
  });

  // -----------------------------
  // Fetch profile & bookings
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all profiles
        const profileRes = await fetch("https://ass-server-sy-travles.onrender.com/visitors");
        const profileArr = await profileRes.json();
        const existingProfile = profileArr.find((p) => p.email === user.email);
        if (existingProfile) setProfileData(existingProfile);

        // Fetch hotel bookings
        const hotelRes = await fetch("https://ass-server-sy-travles.onrender.com/hotelbook");
        const hotelData = await hotelRes.json();
        const userHotelBookings = hotelData.filter((b) => b.userEmail === user.email);
        setHotelBookings(userHotelBookings);

        // Fetch tour bookings
        const tourRes = await fetch("https://ass-server-sy-travles.onrender.com/bookings");
        const tourData = await tourRes.json();
        const userTourBookings = tourData.filter((b) => b.userEmail === user.email);
        setTourBookings(userTourBookings);

        // Calculate stats
        calculateStats(userHotelBookings, userTourBookings);

      } catch (err) {
        console.error('Error fetching data:', err);
        Swal.fire("Error", "Failed to load data.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchData();
  }, [user]);

  // -----------------------------
  // Calculate statistics
  // -----------------------------
  const calculateStats = (hotels, tours) => {
    const totalBookings = hotels.length + tours.length;
    const totalSpent = [
      ...hotels.map(h => parseFloat(h.totalPrice || 0)),
      ...tours.map(t => parseFloat(t.totalPrice || t.price || 0))
    ].reduce((sum, price) => sum + price, 0);

    const currentDate = new Date();
    const upcomingTrips = [
      ...hotels.filter(h => new Date(h.checkIn || h.date) > currentDate),
      ...tours.filter(t => new Date(t.date || t.startDate) > currentDate)
    ].length;

    const completedTrips = totalBookings - upcomingTrips;

    setStats({
      totalBookings,
      totalSpent,
      upcomingTrips,
      completedTrips
    });
  };

  // -----------------------------
  // Handle input changes in modal
  // -----------------------------
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------
  // Save profile (create or update)
  // -----------------------------
 const handleSaveProfile = async () => {
    setSaving(true);

    const payload = {
      displayName: form.displayName || profileData.displayName || "",
      bio: form.bio || profileData.bio || "",
      contact: form.contact || profileData.contact || "",
      location: form.location || profileData.location || "",
      photoURL: form.photoURL || profileData.photoURL || "",
      coverImage: form.coverImage || profileData.coverImage || "",
      facebook: form.facebook || profileData.facebook || "",
      linkedin: form.linkedin || profileData.linkedin || "",
      twitter: form.twitter || profileData.twitter || "",
      email: user?.email || profileData.email || "", // auto-filled
    };

    try {
      const res = await axios.post(
        "https://ass-server-sy-travles.onrender.com/visitors",
        JSON.stringify(payload),
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200 || res.status === 201) {
        Swal.fire("Success", "Profile updated successfully!", "success");
        setModalOpen(false);
        setProfileData(payload);
      } else {
        Swal.fire("Error", "Failed to update profile", "error");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      Swal.fire("Error", err.response?.data?.message || "Something went wrong!", "error");
    } finally {
      setSaving(false);
    }
  };
  // -----------------------------
  // Delete booking
  // -----------------------------
  const handleDeleteBooking = async (id, type) => {
    const url =
      type === "hotel"
        ? `https://ass-server-sy-travles.onrender.com/hotelbook/${id}`
        : `https://ass-server-sy-travles.onrender.com/bookings/${id}`;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the booking permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280"
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(url, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete booking");

        if (type === "hotel") {
          setHotelBookings((prev) => prev.filter((b) => b._id !== id));
        } else {
          setTourBookings((prev) => prev.filter((b) => b._id !== id));
        }
        
        // Recalculate stats
        const updatedHotels = type === "hotel" 
          ? hotelBookings.filter(b => b._id !== id)
          : hotelBookings;
        const updatedTours = type === "tour" 
          ? tourBookings.filter(b => b._id !== id)
          : tourBookings;
        calculateStats(updatedHotels, updatedTours);

        Swal.fire("Deleted!", "Booking has been removed.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete booking.", "error");
      }
    }
  };

  // -----------------------------
  // Export bookings data
  // -----------------------------
  const exportBookings = () => {
    const allBookings = [
      ...hotelBookings.map(b => ({ ...b, type: 'Hotel' })),
      ...tourBookings.map(b => ({ ...b, type: 'Tour' }))
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Type,Name,Date,Price,Status\n"
      + allBookings.map(b => 
          `${b.type},${b.hotelName || b.tourName || b.packageName},"${b.checkIn || b.date}",${b.totalPrice || b.price},${b.status || 'Confirmed'}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -----------------------------
  // Filter bookings
  // -----------------------------
  const getFilteredBookings = (bookings, type) => {
    if (bookingFilter === 'all') return bookings;
    
    const currentDate = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.checkIn || booking.date || booking.startDate);
      if (bookingFilter === 'upcoming') return bookingDate > currentDate;
      if (bookingFilter === 'past') return bookingDate <= currentDate;
      return true;
    });
  };

  // -----------------------------
  // Logout
  // -----------------------------
  

 const handleLogout = async () => {
    try {
      await signOut(auth);   
      setUser(null);         
      navigate("/login");    
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // -----------------------------
  // Loading / Not logged in
  // -----------------------------
  if (!user) {
    return (
      <div className={`flex justify-center items-center h-screen text-xl ${isDark ? "text-white bg-gray-900" : "text-gray-900 bg-gray-100"}`}>
        <div className="text-center">
          <FaSignOutAlt className="text-6xl mb-4 mx-auto opacity-50" />
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="text-center">
          <ClipLoader color={isDark ? "#facc15" : "#3b82f6"} size={50} />
          <p className={`mt-4 ${isDark ? "text-white" : "text-gray-900"}`}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}>
      {/* Header with controls */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"} shadow-md transition-colors`}
          >
            <FaCog />
          </button>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDark ? "bg-yellow-500 text-black hover:bg-yellow-400" : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      {/* Settings dropdown */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute right-4 top-16 p-4 rounded-lg shadow-lg z-50 ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <div className="flex flex-col gap-2 min-w-48">
            <button className="flex items-center gap-2 p-2 hover:bg-opacity-50 hover:bg-gray-500 rounded">
              <FaBell /> Notifications
            </button>
            <button 
              onClick={exportBookings}
              className="flex items-center gap-2 p-2 hover:bg-opacity-50 hover:bg-gray-500 rounded"
            >
              <FaDownload /> Export Data
            </button>
            <button className="flex items-center gap-2 p-2 hover:bg-opacity-50 hover:bg-gray-500 rounded">
              <FaShare /> Share Profile
            </button>
          </div>
        </motion.div>
      )}

      {/* Cover Image */}
      <motion.div 
        className="relative h-64 w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img 
          src={profileData.coverImage || form.coverImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} 
          alt="Cover" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0  bg-opacity-30" />
      </motion.div>

      {/* Profile Card */}
      <motion.div
        className={`max-w-7xl mx-auto -mt-32 shadow-2xl rounded-3xl p-8 relative z-10 ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={profileData.photoURL || user.photoURL || "/api/placeholder/150/150"}
                alt="Profile"
                className={`w-40 h-40 rounded-full border-4 shadow-xl object-cover ${
                  isDark ? "border-green-400" : "border-blue-500"
                }`}
              />
              <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 ${
                isDark ? "bg-green-400 border-gray-800" : "bg-green-500 border-white"
              }`} />
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold mb-2">
                {profileData.displayName || user.displayName || "User"}
              </h2>
              <p className={`flex items-center justify-center md:justify-start gap-2 text-lg ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                <FaEnvelope className="text-sm" /> {user.email}
              </p>
              {profileData.contact && (
                <p className={`flex items-center justify-center md:justify-start gap-2 mt-2 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  <FaPhoneAlt className="text-sm" /> {profileData.contact}
                </p>
              )}
              {profileData.location && (
                <p className={`flex items-center justify-center md:justify-start gap-2 mt-2 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  <FaMapMarkerAlt className="text-sm" /> {profileData.location}
                </p>
              )}
              <p className="mt-4 text-lg leading-relaxed max-w-md">
                {profileData.bio || "Travel enthusiast exploring the world one destination at a time."}
              </p>
              
              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-6 mt-6 text-3xl">
                {profileData.facebook && (
                  <a 
                    href={profileData.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FaFacebook />
                  </a>
                )}
                {profileData.linkedin && (
                  <a 
                    href={profileData.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <FaLinkedin />
                  </a>
                )}
                {profileData.twitter && (
                  <a 
                    href={profileData.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sky-400 hover:text-sky-500 transition-colors"
                  >
                    <FaTwitter />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setForm(profileData);
                setModalOpen(true);
              }} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 ${
                isDark ? "bg-yellow-500 text-black hover:bg-yellow-400" : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              }`}
            >
              <FaEdit /> Edit Profile
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-all hover:scale-105"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Bookings", value: stats.totalBookings, icon: FaBookmark, color: "blue" },
            { label: "Total Spent", value: `$${stats.totalSpent.toFixed(2)}`, icon: FaDollarSign, color: "green" },
            { label: "Upcoming Trips", value: stats.upcomingTrips, icon: FaCalendarAlt, color: "purple" },
            { label: "Completed Trips", value: stats.completedTrips, icon: FaUsers, color: "orange" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-2xl shadow-lg ${
                isDark ? "bg-gray-700" : "bg-gradient-to-br from-white to-gray-50"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
                  <stat.icon className="text-xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b">
          {[
            { id: 'overview', label: 'Overview', icon: FaEye },
            { id: 'hotels', label: `Hotels (${hotelBookings.length})`, icon: FaHotel },
            { id: 'tours', label: `Tours (${tourBookings.length})`, icon: FaMapMarkerAlt }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? isDark 
                    ? "bg-gray-700 text-yellow-400 border-b-2 border-yellow-400" 
                    : "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                  : isDark 
                    ? "text-gray-400 hover:text-white" 
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className={`p-6 rounded-2xl ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[...hotelBookings, ...tourBookings]
                    .sort((a, b) => new Date(b.bookingDate || b.createdAt || 0) - new Date(a.bookingDate || a.createdAt || 0))
                    .slice(0, 5)
                    .map((booking, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {booking.hotelName ? <FaHotel className="text-blue-500" /> : <FaMapMarkerAlt className="text-green-500" />}
                        <div className="flex-1">
                          <p className="font-medium">{booking.hotelName || booking.tourName || booking.packageName}</p>
                          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            {new Date(booking.bookingDate || booking.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-sm font-medium">${booking.totalPrice || booking.price || 0}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className={`p-6 rounded-2xl ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className={`w-full p-3 rounded-lg text-left hover:bg-opacity-50 transition-colors ${
                    isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"
                  }`}>
                    View all bookings
                  </button>
                  <button 
                    onClick={exportBookings}
                    className={`w-full p-3 rounded-lg text-left hover:bg-opacity-50 transition-colors ${
                      isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"
                    }`}
                  >
                    Download booking history
                  </button>
                  <button className={`w-full p-3 rounded-lg text-left hover:bg-opacity-50 transition-colors ${
                    isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"
                  }`}>
                    Manage preferences
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Hotel Bookings Tab */}
        {activeTab === 'hotels' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Hotel Bookings</h3>
              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? "bg-gray-700 text-white" : "bg-white border border-gray-300"
                }`}
              >
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>

            {getFilteredBookings(hotelBookings, 'hotel').length === 0 ? (
              <div className="text-center py-12">
                <FaHotel className="text-6xl mx-auto mb-4 opacity-30" />
                <p className="text-xl mb-2">No hotel bookings found</p>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  {bookingFilter === 'all' ? "You haven't made any hotel bookings yet." : `No ${bookingFilter} hotel bookings.`}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {getFilteredBookings(hotelBookings, 'hotel').map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    className={`p-6 rounded-2xl shadow-lg ${
                      isDark ? "bg-gray-700" : "bg-white"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold mb-2">{booking.hotelName}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Check-in</p>
                            <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Check-out</p>
                            <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Guests</p>
                            <p>{booking.guests || 1}</p>
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Total</p>
                            <p className="text-lg font-bold">${booking.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className={`p-2 rounded-lg ${
                          isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                        } text-white transition-colors`}>
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleDeleteBooking(booking._id, "hotel")}
                          className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tour Bookings Tab */}
        {activeTab === 'tours' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Tour Bookings</h3>
              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? "bg-gray-700 text-white" : "bg-white border border-gray-300"
                }`}
              >
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>

            {getFilteredBookings(tourBookings, 'tour').length === 0 ? (
              <div className="text-center py-12">
                <FaMapMarkerAlt className="text-6xl mx-auto mb-4 opacity-30" />
                <p className="text-xl mb-2">No tour bookings found</p>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  {bookingFilter === 'all' ? "You haven't made any tour bookings yet." : `No ${bookingFilter} tour bookings.`}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {getFilteredBookings(tourBookings, 'tour').map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    className={`p-6 rounded-2xl shadow-lg ${
                      isDark ? "bg-gray-700" : "bg-white"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {booking.image && (
                        <div className="lg:w-48 h-32 lg:h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={booking.image}
                            alt={booking.tourName || booking.packageName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold mb-2">
                              {booking.tourName || booking.packageName || "Tour Package"}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                              <div>
                                <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                  Date
                                </p>
                                <p>{new Date(booking.date || booking.startDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                  Duration
                                </p>
                                <p>{booking.duration || "N/A"}</p>
                              </div>
                              <div>
                                <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                  Travelers
                                </p>
                                <p>{booking.travelers || booking.guests || 1}</p>
                              </div>
                              {booking.location && (
                                <div className="md:col-span-2">
                                  <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                    Location
                                  </p>
                                  <p>{booking.location}</p>
                                </div>
                              )}
                            </div>
                            
                            {booking.description && (
                              <p className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                {booking.description.length > 150 
                                  ? `${booking.description.substring(0, 150)}...` 
                                  : booking.description
                                }
                              </p>
                            )}

                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                new Date(booking.date || booking.startDate) > new Date()
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {new Date(booking.date || booking.startDate) > new Date() ? "Upcoming" : "Completed"}
                              </span>
                              {booking.category && (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  isDark ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
                                }`}>
                                  {booking.category}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                Total Price
                              </p>
                              <p className="text-2xl font-bold text-green-500">
                                ${booking.totalPrice || booking.price || 0}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <button 
                                className={`p-2 rounded-lg ${
                                  isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                                } text-white transition-colors`}
                                title="View Details"
                              >
                                <FaEye />
                              </button>
                              <button 
                                onClick={() => handleDeleteBooking(booking._id, "tour")}
                                className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                                title="Delete Booking"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Edit Profile Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <motion.div
        className={`p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={() => setModalOpen(false)}
            className={`p-2 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-3">Basic Information</h3>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={user?.email || profileData.email || ""}
                readOnly
                className={`w-full p-3 rounded-lg border bg-gray-100 text-gray-700 cursor-not-allowed ${
                  isDark ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                name="displayName"
                placeholder="Your display name"
                defaultValue={profileData.displayName || ""}
                onChange={handleInput}
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
                    : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                placeholder="Tell us about yourself..."
                defaultValue={profileData.bio || ""}
                onChange={handleInput}
                rows={3}
                className={`w-full p-3 rounded-lg border resize-none ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
                    : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="contact"
                placeholder="+1 234 567 8900"
                defaultValue={profileData.contact || ""}
                onChange={handleInput}
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
                    : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                placeholder="City, Country"
                defaultValue={profileData.location || ""}
                onChange={handleInput}
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
                    : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              />
            </div>
          </div>

          {/* Images & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-3">Images & Social</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Profile Picture URL</label>
              <input
                type="url"
                name="photoURL"
                placeholder="https://example.com/your-photo.jpg"
                defaultValue={profileData.photoURL || ""}
                onChange={handleInput}
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
                    : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image URL</label>
              <input
                type="url"
                name="coverImage"
                placeholder="https://example.com/cover-image.jpg"
                defaultValue={profileData.coverImage || ""}
                onChange={handleInput}
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
                    : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Facebook URL</label>
              <input
                type="url"
                name="facebook"
                placeholder="https://facebook.com/yourprofile"
                defaultValue={profileData.facebook || ""}
                onChange={handleInput}
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
                    : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/yourprofile"
                defaultValue={profileData.linkedin || ""}
                onChange={handleInput}
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
                    : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Twitter URL</label>
              <input
                type="url"
                name="twitter"
                placeholder="https://twitter.com/yourhandle"
                defaultValue={profileData.twitter || ""}
                onChange={handleInput}
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600 focus:border-yellow-500"
                    : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-300">
          <button
            onClick={() => setModalOpen(false)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isDark ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              saving ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            } ${isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <ClipLoader size={16} color="white" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </motion.div>
    </div>
      )}
    </div>
  );
}