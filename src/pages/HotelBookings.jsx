// src/pages/MyHotelBookings.jsx
import React, { useContext, useState } from "react";
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
} from "react-icons/fa";

const featureIcons = {
  hotel: <FaHotel className="text-yellow-500" />,
  car: <FaCar className="text-blue-500" />,
  boat: <FaShip className="text-purple-500" />,
  restaurant: <FaUtensils className="text-green-500" />,
};

export default function MyHotelBookings({ bookings = [], refreshBookings }) {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [loadingId, setLoadingId] = useState(null);

  // Filter bookings by logged-in user
  const userBookings = bookings.filter((b) => b.userEmail === user?.email);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking?",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
    });
    if (!result.isConfirmed) return;

    try {
      setLoadingId(id);
      const res = await fetch(`https://ass-server-1.onrender.com/hotelbook/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      Swal.fire({ icon: "success", title: "Booking Cancelled" });
      refreshBookings();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed", text: "Could not cancel booking" });
    } finally {
      setLoadingId(null);
    }
  };

  if (!user)
    return (
      <p className={`text-center mt-10 ${theme === "dark" ? "text-white" : "text-gray-600"}`}>
        Please login to view your hotel bookings.
      </p>
    );

  if (userBookings.length === 0)
    return (
      <p className={`text-center mt-10 ${theme === "dark" ? "text-white" : "text-gray-600"}`}>
        You have no hotel bookings yet.
      </p>
    );

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const card = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } }, hover: { scale: 1.02, transition: { duration: 0.3 } } };

  return (
    <motion.div
      className={`max-w-7xl mx-auto px-4 py-10 flex flex-col gap-10 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {userBookings.map((b, idx) => (
        <motion.div
          key={b._id}
          className={`flex flex-col md:flex-row items-center gap-6 ${
            idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          } bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6`}
          variants={card}
          whileHover="hover"
        >
          {/* Hotel Image */}
          <div className="md:w-1/2 w-full rounded-2xl overflow-hidden relative">
            <img src={b.photoUrl || "https://placehold.co/600x400"} alt={b.hotelName} className="w-full h-64 object-cover" />
            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow">Booked</div>
          </div>

          {/* Card Body */}
          <div className="md:w-1/2 w-full flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-500" /> {b.hotelName}
            </h2>

            <p className="flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt className="text-red-500" /> {b.hotelLocation}
            </p>

            <p className="flex items-center gap-2 text-gray-600">
              <FaCalendarAlt className="text-purple-500" /> {new Date(b.bookedAt).toLocaleDateString()}
            </p>

            <p className="flex items-center gap-2 font-semibold text-green-600">
              <FaDollarSign /> ${b.hotelPrice} / night
            </p>

            {/* User Info */}
            <div className="flex items-center gap-3 mt-2 border-t pt-3">
              <img src={b.userPhoto || "https://via.placeholder.com/40"} alt={b.userName} className="w-12 h-12 rounded-full border object-cover" />
              <div className="flex flex-col">
                <p className="flex items-center gap-1 font-medium text-gray-800">
                  <FaUserCircle className="text-blue-500" /> {b.userName}
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-500">
                  <FaEnvelope className="text-gray-400" /> {b.userEmail}
                </p>
              </div>
            </div>

            {/* Features */}
            {b.features && (
              <div className="flex gap-3 mt-2 flex-wrap">
                {Object.keys(b.features).map(
                  (key) =>
                    b.features[key] && (
                      <div key={key} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-medium">
                        {featureIcons[key]} <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      </div>
                    )
                )}
              </div>
            )}

            {/* Google Map */}
            {b.googleMap && (
              <div className="mt-4 w-full h-48 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <iframe
                  src={b.googleMap}
                  title={`Map of ${b.hotelName}`}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => Swal.fire("Booking Details", JSON.stringify(b, null, 2), "info")}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </button>
              <button
                onClick={() => handleDelete(b._id)}
                disabled={loadingId === b._id}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaTrashAlt /> {loadingId === b._id ? "Deleting..." : "Cancel Booking"}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
