// src/pages/MyBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext"; 
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaUserCircle,
  FaEnvelope,
  FaUser,
  FaHotel,
  FaCar,
  FaShip,
  FaUtensils,
  FaTrashAlt,
  FaEye,
} from "react-icons/fa";

const featureIcons = {
  hotel: <FaHotel className="text-yellow-500" />,
  car: <FaCar className="text-blue-500" />,
  boat: <FaShip className="text-purple-500" />,
  restaurant: <FaUtensils className="text-green-500" />,
};

export default function ToursBookings() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch bookings for logged-in user
  const fetchBookings = () => {
    if (!user?.email) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`https://ass-server-sy-travles.onrender.com/bookings?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        const userBookings = data.filter((b) => b.userEmail === user.email);
        setBookings(userBookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  // Cancel booking handler
  const handleCancel = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking? This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
      background: theme === "dark" ? "#1f2937" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#000000",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280"
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`https://ass-server-sy-travles.onrender.com/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to cancel booking");
      Swal.fire({ 
        icon: "success", 
        title: "Booking Cancelled",
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000"
      });
      fetchBookings(); // refresh bookings
    } catch (err) {
      console.error(err);
      Swal.fire({ 
        icon: "error", 
        title: "Failed", 
        text: "Could not cancel booking",
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000"
      });
    }
  };

  if (!user)
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="text-center">
          <FaUserCircle className="text-6xl mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-medium">Please login to view your bookings.</p>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading your bookings...</p>
        </div>
      </div>
    );

  if (bookings.length === 0)
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="text-center">
          <FaCalendarAlt className="text-6xl mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-medium mb-2">No bookings found</p>
          <p className="text-gray-500">Start exploring and book your first tour!</p>
          <button
            onClick={() => navigate("/tours")}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            Browse Tours
          </button>
        </div>
      </div>
    );

  const container = { 
    hidden: { opacity: 0 }, 
    show: { opacity: 1, transition: { staggerChildren: 0.15 } } 
  };
  
  const card = { 
    hidden: { opacity: 0, y: 30 }, 
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, 
    hover: { y: -5, transition: { duration: 0.3 } } 
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      {/* Header */}
      <div className={`border-b ${theme === "dark" ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className={`text-4xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
            My Bookings
          </h1>
          <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Manage and view all your tour bookings
          </p>
        </div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 py-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="space-y-8">
          {bookings.map((b, idx) => (
            <motion.div
              key={b._id}
              className={`overflow-hidden rounded-2xl shadow-xl transition-all duration-500 ${
                theme === "dark" 
                  ? "bg-gray-900 border border-gray-800 shadow-2xl" 
                  : "bg-white border border-gray-200 shadow-lg"
              }`}
              variants={card}
              whileHover="hover"
            >
              <div className={`flex flex-col lg:flex-row ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                {/* Image Section */}
                <div className="lg:w-2/5 relative group">
                  <div className="aspect-[4/3] lg:h-80 overflow-hidden">
                    <img
                      src={b.photoUrl || "https://placehold.co/600x400"}
                      alt={b.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0  bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      ✓ Confirmed
                    </span>
                  </div>

                  {/* Booking Date Badge */}
                  <div className="absolute bottom-4 right-4">
                    <div className={`px-3 py-2 rounded-lg backdrop-blur-sm ${
                      theme === "dark" ? "bg-black bg-opacity-70 text-white" : "bg-white bg-opacity-90 text-black"
                    }`}>
                      <p className="text-xs font-medium">Booked</p>
                      <p className="text-sm font-bold">{new Date(b.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-3/5 p-6 lg:p-8">
                  {/* Title */}
                  <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                    {b.title || "Tour Package"}
                  </h2>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-red-500 text-lg" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Pickup Location</p>
                          <p className={`font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                            {b.pickupLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <FaCalendarAlt className="text-blue-500 text-lg" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Travel Dates</p>
                          <p className={`font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                            {new Date(b.travelDate).toLocaleDateString()} → {new Date(b.returnDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {b.price && (
                        <div className="flex items-center gap-3">
                          <FaDollarSign className="text-green-500 text-lg" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Total Price</p>
                            <p className="text-2xl font-bold text-green-600">${b.price}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Info Card */}
                  <div className={`p-4 rounded-xl mb-6 ${
                    theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
                  }`}>
                    <div className="flex items-center gap-4">
                      <img
                        src={b.userPhoto || "https://via.placeholder.com/50"}
                        alt={b.userName}
                        className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
                      />
                      <div className="flex-1">
                        <p className={`font-semibold flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
                          <FaUser className="text-blue-500" /> {b.userName}
                        </p>
                        <p className={`text-sm flex items-center gap-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          <FaEnvelope className="text-gray-500" /> {b.userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  {b.features && Object.keys(b.features).some(key => b.features[key]) && (
                    <div className="mb-6">
                      <h4 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Included Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(b.features).map((key) =>
                          b.features[key] ? (
                            <div
                              key={key}
                              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                                theme === "dark" 
                                  ? "bg-gray-700 text-gray-200 border border-gray-600" 
                                  : "bg-gray-100 text-gray-800 border border-gray-300"
                              }`}
                            >
                              {featureIcons[key]}
                              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}

                  {/* Map */}
                  {b.mapUrl && (
                    <div className="mb-6">
                      <h4 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Location Map
                      </h4>
                      <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-gray-300">
                        <iframe 
                          src={b.mapUrl} 
                          title="Tour Map" 
                          className="w-full h-full" 
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  {b.specialRequests && (
                    <div className="mb-6">
                      <h4 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Special Requests
                      </h4>
                      <div className={`p-4 rounded-xl ${
                        theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
                      }`}>
                        <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          {b.specialRequests}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => navigate(`/tour/${b.tourId}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <FaEye /> View Tour Details
                    </button>
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <FaTrashAlt /> Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}