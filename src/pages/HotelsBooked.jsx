// src/pages/MyHotelsBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Confetti from "react-confetti";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTrashAlt,
  FaHotel,
  FaStar,
} from "react-icons/fa";

const MySwal = withReactContent(Swal);

// ---------- Booking Card ----------
const BookingCard = ({ booking, theme, onDelete, index }) => (
  <div
    style={{ animationDelay: `${index * 0.15}s` }}
    className={`group relative rounded-3xl p-8 transition-all duration-700 hover:-translate-y-3 hover:rotate-1 opacity-0 animate-fadeInUp overflow-hidden ${
      theme === "dark"
        ? "bg-gradient-to-br from-gray-800/90 via-gray-800/70 to-gray-900/90 backdrop-blur-xl border border-gray-700/30 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/25"
        : "bg-gradient-to-br from-white/95 via-white/90 to-gray-50/95 backdrop-blur-xl border border-gray-200/50 hover:border-blue-500/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25"
    }`}
  >
    <div className="flex-shrink-0">
      <div className="relative overflow-hidden rounded-2xl w-full xl:w-52 h-52 shadow-lg">
        <img
          src={booking.photoUrl || "https://source.unsplash.com/400x300/?luxury+hotel"}
          alt={booking.hotelName}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
        <div
          className={`absolute top-4 right-4 px-3 py-2 rounded-2xl text-sm font-bold flex items-center space-x-2 shadow-lg transform transition-all duration-500 group-hover:scale-110 ${
            theme === "dark"
              ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900"
              : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
          }`}
        >
          <FaStar className="animate-pulse" /> <span>{booking.starRating}</span>
        </div>
        <div
          className={`absolute bottom-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 ${
            theme === "dark" ? "bg-gray-800/80 text-cyan-400" : "bg-white/90 text-blue-600"
          }`}
        >
          <FaHotel />
        </div>
      </div>
    </div>

    <div className="flex-grow flex flex-col gap-6 mt-4">
      <h3
        className={`text-3xl xl:text-4xl font-black mb-2 leading-tight ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {booking.hotelName}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className={`flex items-center gap-4 p-4 rounded-2xl border ${
            theme === "dark" ? "border-gray-600 bg-gray-700/30" : "border-gray-200 bg-gray-50/80"
          }`}
        >
          <FaMapMarkerAlt className="text-2xl text-red-500" />
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Location</p>
            <p className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {booking.hotelLocation}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-4 p-4 rounded-2xl border ${
            theme === "dark" ? "border-gray-600 bg-gray-700/30" : "border-gray-200 bg-gray-50/80"
          }`}
        >
          <FaMoneyBillWave className="text-2xl text-green-500" />
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Price / night</p>
            <p className={`text-sm font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
              ${booking.hotelPrice}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(booking._id)}
        className={`px-6 py-3 rounded-2xl font-bold text-white transition-all duration-500 ${
          theme === "dark" ? "bg-red-600 hover:bg-red-500" : "bg-red-500 hover:bg-red-400"
        }`}
      >
        <FaTrashAlt className="inline mr-2" /> Delete Booking
      </button>
    </div>
  </div>
);

// ---------- Main Component ----------
const MyHotelsBookings = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user) return <Navigate to="/login" replace />;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`https://ass-server-sy-travles.onrender.com/hotelbook?email=${user.email}`);
        const data = await res.json();

        // Only show current user's bookings
        const userBookings = (data || []).filter(booking => booking.userEmail === user.email);
        setBookings(userBookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user.email]);

  const handleDelete = (id) => {
    MySwal.fire({
      title: "Delete Booking?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: theme === "dark" ? "#1f2937" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://ass-server-sy-travles.onrender.com/hotelbook/${id}`, { method: "DELETE" })
          .then(() => setBookings((prev) => prev.filter((b) => b._id !== id)))
          .then(() =>
            MySwal.fire({
              title: "Deleted!",
              text: "Your booking has been deleted.",
              icon: "success",
              background: theme === "dark" ? "#1f2937" : "#fff",
              color: theme === "dark" ? "#fff" : "#000",
            })
          )
          .catch((err) => console.error(err));
      }
    });
  };

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <p className={`text-xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Loading your bookings...</p>
      </div>
    );

  if (bookings.length === 0)
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center relative ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        {/* Confetti */}
        <Confetti numberOfPieces={100} recycle={false} gravity={0.3} />

        {/* Modern Empty State */}
        <div className={`p-10 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-6 text-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
          <img
            src="https://i.ibb.co/2N2cG1t/empty-state.png"
            alt="No Bookings"
            className="w-48 h-48 object-contain"
          />
          <h2 className="text-3xl font-extrabold">No Bookings Found!</h2>
          <p className="text-lg text-gray-400">Looks like you haven’t booked any hotels yet.</p>
          <Link to="/hotels" className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Browse Hotels
          </Link>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen px-4 py-16 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <h1 className={`text-4xl font-black mb-8 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>My Hotel Bookings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {bookings.map((b, i) => (
          <BookingCard key={b._id} booking={b} theme={theme} onDelete={handleDelete} index={i} />
        ))}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default MyHotelsBookings;
