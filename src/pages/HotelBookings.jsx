// src/pages/MyHotelBookings.jsx
import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
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
  FaStar,
  FaEye,
  FaSpinner,
} from "react-icons/fa";

const featureIcons = {
  hotel: <FaHotel className="text-amber-500" />,
  car: <FaCar className="text-blue-500" />,
  boat: <FaShip className="text-purple-500" />,
  restaurant: <FaUtensils className="text-emerald-500" />,
};

export default function MyHotelBookings() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [bookings, setBookings] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("https://ass-server-sy-travles.onrender.com/hotelbook");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };
    fetchBookings();
  }, []);

  // Filter bookings by logged-in user
  const userBookings = bookings.filter((b) => b.userEmail === user?.email);

  // Delete booking
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking?",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
      background: theme === "dark" ? "#1f2937" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#000000",
    });
    if (!result.isConfirmed) return;

    try {
      setLoadingId(id);
      const res = await fetch(`https://ass-server-sy-travles.onrender.com/hotelbook/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      
      Swal.fire({ 
        icon: "success", 
        title: "Booking Cancelled",
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
      });

      // Refresh bookings
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire({ 
        icon: "error", 
        title: "Failed", 
        text: "Could not cancel booking",
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
      });
    } finally {
      setLoadingId(null);
    }
  };

  // No user logged in
  if (!user)
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className={`text-center p-8 rounded-2xl shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-600"
        }`}>
          <FaUserCircle className="mx-auto text-6xl mb-4 text-blue-500" />
          <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
          <p>Please login to view your hotel bookings.</p>
        </div>
      </div>
    );

  // No bookings for this user
  if (userBookings.length === 0)
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className={`text-center p-8 rounded-2xl shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-600"
        }`}>
          <FaHotel className="mx-auto text-6xl mb-4 text-blue-500" />
          <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
          <p>You have no hotel bookings yet.</p>
        </div>
      </div>
    );

  const container = { 
    hidden: { opacity: 0 }, 
    show: { opacity: 1, transition: { staggerChildren: 0.1 } } 
  };
  
  const card = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { y: -5, transition: { duration: 0.3 } },
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            My Hotel Bookings
          </h1>
          <p className={`text-lg ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
            Manage your hotel reservations and bookings
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </motion.div>

        <motion.div
          className="flex flex-col gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {userBookings.map((booking, idx) => (
            <motion.div
              key={booking._id}
              className={`group relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 ${
                theme === "dark" 
                  ? "bg-gray-800 border border-gray-700 hover:border-gray-600" 
                  : "bg-white border border-gray-200 hover:border-gray-300"
              }`}
              variants={card}
              whileHover="hover"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className={`flex flex-col lg:flex-row ${
                idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}>
                {/* Hotel Image */}
                <div className="lg:w-1/2 w-full relative overflow-hidden">
                  <div className="aspect-video lg:aspect-square relative">
                    <img
                      src={booking.photoUrl || "https://placehold.co/600x400"}
                      alt={booking.hotelName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                        Active Booking
                      </span>
                    </div>

                    {/* Star Rating Overlay */}
                    {booking.starRating && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                        {Array.from({ length: booking.starRating }).map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-sm" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2 w-full p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Hotel Name */}
                    <div>
                      <h2 className={`text-3xl font-bold mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>
                        {booking.hotelName}
                      </h2>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500 text-sm" />
                        <span className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}>
                          {booking.hotelLocation}
                        </span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={`flex items-center gap-3 p-3 rounded-xl ${
                        theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                      }`}>
                        <FaCalendarAlt className="text-purple-500" />
                        <div>
                          <p className={`text-xs font-medium ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}>
                            Booked On
                          </p>
                          <p className={`font-semibold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}>
                            {new Date(booking.bookedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-3 p-3 rounded-xl ${
                        theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                      }`}>
                        <FaDollarSign className="text-emerald-500" />
                        <div>
                          <p className={`text-xs font-medium ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}>
                            Price per Night
                          </p>
                          <p className="font-bold text-emerald-600 text-lg">
                            ${booking.hotelPrice}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* User Information */}
                    <div className={`flex items-center gap-4 p-4 rounded-xl border ${
                      theme === "dark" 
                        ? "bg-gray-700/30 border-gray-600" 
                        : "bg-gray-50 border-gray-200"
                    }`}>
                      <img
                        src={booking.userPhoto || "https://via.placeholder.com/48"}
                        alt={booking.userName}
                        className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
                      />
                      <div className="flex-1">
                        <p className={`font-semibold flex items-center gap-2 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>
                          <FaUser className="text-blue-500 text-sm" />
                          {booking.userName}
                        </p>
                        <p className={`text-sm flex items-center gap-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}>
                          <FaEnvelope className="text-gray-400 text-xs" />
                          {booking.userEmail}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    {booking.features && (
                      <div className="space-y-2">
                        <h4 className={`font-semibold text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}>
                          Available Features
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                          {Object.keys(booking.features).map(
                            (key) =>
                              booking.features[key] && (
                                <div
                                  key={key}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                                    theme === "dark"
                                      ? "bg-gray-700 border-gray-600 text-gray-300"
                                      : "bg-white border-gray-200 text-gray-700"
                                  }`}
                                >
                                  {featureIcons[key]}
                                  <span className="capitalize">{key}</span>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Google Map */}
                  {booking.googleMap && (
                    <div className="mt-6">
                      <h4 className={`font-semibold text-sm mb-3 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Location Map
                      </h4>
                      <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                        <iframe
                          src={booking.googleMap}
                          title={`Map of ${booking.hotelName}`}
                          className="w-full h-full"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Booking Details",
                          html: `<pre class="text-left text-xs">${JSON.stringify(booking, null, 2)}</pre>`,
                          icon: "info",
                          width: 800,
                          background: theme === "dark" ? "#1f2937" : "#ffffff",
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        })
                      }
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      } transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <FaEye />
                      View Details
                    </button>

                    <button
                      onClick={() => handleDelete(booking._id)}
                      disabled={loadingId === booking._id}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        loadingId === booking._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : theme === "dark"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:transform-none`}
                    >
                      {loadingId === booking._id ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <FaTrashAlt />
                          Cancel Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}