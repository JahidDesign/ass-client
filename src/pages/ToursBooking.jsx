// src/pages/MyBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
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
} from "react-icons/fa";

const featureIcons = {
  hotel: <FaHotel className="text-yellow-500" />,
  car: <FaCar className="text-blue-500" />,
  boat: <FaShip className="text-purple-500" />,
  restaurant: <FaUtensils className="text-green-500" />,
};

export default function ToursBookings() {
  const { user } = useContext(AuthContext);
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
    fetch(`https://ass-server-1.onrender.com/bookings?email=${user.email}`)
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
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`https://ass-server-1.onrender.com/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to cancel booking");
      Swal.fire({ icon: "success", title: "Booking Cancelled" });
      fetchBookings(); // refresh bookings
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed", text: "Could not cancel booking" });
    }
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-600">Please login to view your bookings.</p>;
  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading bookings...</p>;
  if (bookings.length === 0)
    return <p className="text-center mt-10 text-gray-600">You have no bookings yet.</p>;

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const card = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } }, hover: { scale: 1.02, transition: { duration: 0.3 } } };

  return (
    <motion.div className="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-10" variants={container} initial="hidden" animate="show">
      {bookings.map((b, idx) => (
        <motion.div
          key={b._id}
          className={`flex flex-col md:flex-row items-center gap-6 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} bg-white shadow-lg rounded-2xl p-6`}
          variants={card}
          whileHover="hover"
        >
          {/* Tour Image */}
          <div className="md:w-1/2 w-full rounded-2xl overflow-hidden relative">
            <img src={b.photoUrl || "https://placehold.co/600x400"} alt={b.title} className="w-full h-64 object-cover" />
            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow">Booked</div>
          </div>

          {/* Card Body */}
          <div className="md:w-1/2 w-full flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-500" /> {b.title || "Tour Package"}
            </h2>

            {/* Pickup Location */}
            <p className="flex items-center gap-2 text-gray-600"><FaMapMarkerAlt className="text-red-500" /> {b.pickupLocation}</p>

            {/* Travel Dates */}
            <p className="flex items-center gap-2 text-gray-600">
              <FaCalendarAlt className="text-purple-500" /> {new Date(b.travelDate).toLocaleDateString()} → {new Date(b.returnDate).toLocaleDateString()}
            </p>

            {/* Price */}
            {b.price && <p className="flex items-center gap-2 font-semibold text-green-600"><FaDollarSign /> ${b.price}</p>}

            {/* User Info */}
            <div className="flex items-center gap-3 mt-2 border-t pt-3">
              <img src={b.userPhoto || "https://via.placeholder.com/40"} alt={b.userName} className="w-12 h-12 rounded-full border object-cover" />
              <div className="flex flex-col">
                <p className="flex items-center gap-1 font-medium text-gray-800"><FaUserCircle className="text-blue-500" /> {b.userName}</p>
                <p className="flex items-center gap-1 text-sm text-gray-500"><FaEnvelope className="text-gray-400" /> {b.userEmail}</p>
              </div>
            </div>

            {/* Features */}
            {b.features && (
              <div className="flex gap-3 mt-2 flex-wrap">
                {Object.keys(b.features).map((key) =>
                  b.features[key] ? (
                    <div key={key} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                      {featureIcons[key]} <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    </div>
                  ) : null
                )}
              </div>
            )}

            {/* Map */}
            {b.mapUrl && <div className="mt-4 w-full h-48 rounded-lg overflow-hidden border"><iframe src={b.mapUrl} title="Tour Map" className="w-full h-full" loading="lazy" /></div>}

            {/* Special Requests */}
            {b.specialRequests && <div className="mt-3 p-3 bg-gray-50 rounded text-gray-700 text-sm whitespace-pre-line"><strong>Special Requests:</strong><p className="mt-1">{b.specialRequests}</p></div>}

            {/* Buttons */}
            <div className="flex gap-3 mt-3">
              <button onClick={() => navigate(`/tour/${b.tourId}`)} className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">View Tour Details</button>
              <button onClick={() => handleCancel(b._id)} className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"><FaTrashAlt /> Cancel Booking</button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
