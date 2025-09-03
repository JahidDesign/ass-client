// src/pages/HotelDetails.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

// -------------------
// Enhanced Banner Component
// -------------------
const HotelBanner = ({ hotel }) => {
  if (!hotel) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl group"
    >
      <img
        src={hotel.photoUrl || "https://source.unsplash.com/1000x500/?hotel"}
        alt={hotel.hotelName}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
            {hotel.hotelName}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {hotel.hotelLocation}
          </p>
          
          {/* Star Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${i < Math.round(hotel.starRating || 0) ? 'text-yellow-400' : 'text-gray-400'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-yellow-400 font-semibold text-lg">
              {hotel.starRating} Stars
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* Price Badge */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-3 rounded-2xl shadow-lg"
      >
        <div className="text-2xl font-bold">{hotel.hotelPrice}</div>
        <div className="text-sm opacity-90">per night</div>
      </motion.div>
    </motion.div>
  );
};

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState(false);

  // ---------- helpers ----------
  const stars = useMemo(() => {
    const n = Number(hotel?.starRating || 0);
    return "★".repeat(Math.max(0, Math.min(5, Math.round(n))));
  }, [hotel]);

  const buildMapEmbedSrc = (h) => {
    if (!h) return null;
    const raw = (h.googleMap || "").trim();
    if (!raw) return null;

    // If user mistakenly stored an image URL in googleMap, don't iframe it
    const isImage = /(\.jpg|\.jpeg|\.png|\.webp|i\.ibb\.co)/i.test(raw);
    if (isImage) return { type: "image", src: raw };

    // If already an embeddable URL
    if (/\/embed\?/i.test(raw)) return { type: "iframe", src: raw };

    // If it's a standard Google Maps share link
    if (/maps\.app\.goo\.gl|google\.com\/maps/i.test(raw)) {
      const q = encodeURIComponent(`${h.hotelName || "Hotel"} ${h.hotelLocation || ""}`.trim());
      return { type: "iframe", src: `https://www.google.com/maps?q=${q}&output=embed` };
    }

    // Fallback: try searching by location
    if (h.hotelLocation) {
      const q = encodeURIComponent(`${h.hotelName || "Hotel"} ${h.hotelLocation}`.trim());
      return { type: "iframe", src: `https://www.google.com/maps?q=${q}&output=embed` };
    }
    return null;
  };

  // ---------- fetch hotel ----------
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://ass-server-sy-travles.onrender.com/hotels/${id}`);
        if (!res.ok) throw new Error(`Failed to load hotel ${id}`);
        const data = await res.json();
        if (!cancelled) setHotel(data);
      } catch (e) {
        console.error("Hotel fetch error:", e);
        if (!cancelled) setHotel(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ---------- check if already booked ----------
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user) {
        setBooked(false);
        return;
      }
      try {
        const res = await fetch("https://ass-server-sy-travles.onrender.com/hotelbook");
        if (!res.ok) throw new Error("Failed to load bookings");
        const bookings = await res.json();
        const already = bookings?.some(
          (b) => String(b?.hotelId) === String(id) && String(b?.userEmail) === String(user.email)
        );
        if (!cancelled) setBooked(Boolean(already));
      } catch (e) {
        console.error("Booking check error:", e);
        if (!cancelled) setBooked(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  // ---------- booking ----------
  const handleBookNow = async () => {
    if (!user) {
      MySwal.fire({
        icon: "warning",
        title: "Login required",
        text: "Please login to book this hotel.",
        confirmButtonText: "Go to Login",
        showCancelButton: true,
        cancelButtonText: "Stay here",
      }).then((r) => {
        if (r.isConfirmed) navigate("/login");
      });
      return;
    }
    if (!hotel) return;
    if (booked) return;

    const payload = {
      hotelId: hotel._id,
      hotelName: hotel.hotelName,
      hotelLocation: hotel.hotelLocation,
      hotelPrice: hotel.hotelPrice,
      starRating: hotel.starRating,
      photoUrl: hotel.photoUrl,
      userName: user.displayName || user.name || user.email?.split("@")[0] || "Guest",
      userEmail: user.email,
      userPhoto: user.photoURL || "",
      bookedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("https://ass-server-sy-travles.onrender.com/hotelbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Booking failed");

      setBooked(true);
      MySwal.fire({
        icon: "success",
        title: "Booking confirmed!",
        html: `<p>You booked <strong>${hotel.hotelName}</strong>.</p>`,
        confirmButtonText: "My Bookings",
        showCancelButton: true,
        cancelButtonText: "Close",
      }).then((r) => {
        if (r.isConfirmed) navigate("/myallbookings");
      });
    } catch (e) {
      console.error("Booking error:", e);
      MySwal.fire({ icon: "error", title: "Booking failed", text: e.message || "Please try again." });
    }
  };

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-8">
            <div className="h-72 md:h-96 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-3xl" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              </div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}>
        <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-screen">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Hotel Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Sorry, we couldn't find the hotel you're looking for.</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mapEmbed = buildMapEmbedSrc(hotel);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}>
      <div className="max-w-7xl mx-auto p-6 pt-8">
        {/* Enhanced Banner */}
        <HotelBanner hotel={hotel} />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-8"
        >
          {/* Left Column - Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-2 space-y-8"
          >
            {/* Hotel Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    About {hotel.hotelName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {hotel.hotelLocation}
                  </p>
                </div>
                
                {/* Rating Display */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl text-center shadow-lg">
                  <div className="text-2xl font-bold">{hotel.starRating}</div>
                  <div className="text-sm opacity-90">Star Rating</div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(hotel.starRating || 0) ? 'text-white' : 'text-white/40'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Features */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hotel Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hotel.features?.wifi && (
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Wi-Fi</span>
                    </div>
                  )}
                  {hotel.features?.restaurant && (
                    <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-700">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Restaurant</span>
                    </div>
                  )}
                  {hotel.features?.parking && (
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Parking</span>
                    </div>
                  )}
                  {hotel.features?.conference && (
                    <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Conference</span>
                    </div>
                  )}
                  {hotel.features?.banquet && (
                    <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg border border-pink-200 dark:border-pink-700">
                      <div className="w-8 h-8 bg-pink-100 dark:bg-pink-800 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-pink-700 dark:text-pink-300">Banquet</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {hotel.description || "Experience luxury and comfort at its finest. Our hotel offers world-class amenities and exceptional service to make your stay memorable."}
                </p>
              </div>
            </div>

            {/* Map Section */}
            {mapEmbed && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Hotel Location
                  </h3>
                </div>
                <div className="relative">
                  {mapEmbed.type === "iframe" ? (
                    <iframe
                      src={mapEmbed.src}
                      title="Hotel Map"
                      className="w-full h-64 md:h-80"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <img
                      src={mapEmbed.src}
                      alt="Hotel map or location"
                      className="w-full h-64 md:h-80 object-cover"
                    />
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Booking Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="md:col-span-1"
          >
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                {/* Price Display */}
                <div className="text-center mb-6 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                  <p className="text-sm opacity-90">Starting from</p>
                  <p className="text-4xl font-bold">{hotel.hotelPrice}</p>
                  <p className="text-sm opacity-90">per night</p>
                </div>

                {/* Booking Status */}
                <div className="space-y-4 mb-6">
                  {booked && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-700 dark:text-green-300 font-medium">Already Booked</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: booked ? 1 : 1.02 }}
                    whileTap={{ scale: booked ? 1 : 0.98 }}
                    onClick={handleBookNow}
                    disabled={booked}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:shadow-xl ${
                      booked 
                        ? "bg-green-500 text-white cursor-default shadow-green-200 dark:shadow-green-900" :
                        "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-200 dark:shadow-blue-900 active:scale-95"
                    }`}
                  >
                    {booked ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Booking Completed
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Book This Hotel
                      </span>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(-1)}
                    className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-all duration-200 hover:shadow-lg"
                  >
                    ← Go Back
                  </motion.button>
                </div>

                {/* Hotel Highlights */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                    Why Choose Us
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      24/7 Customer Support
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Free Cancellation
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Best Price Guarantee
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Instant Confirmation
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Need help with your booking?
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 text-center font-medium mt-1">
                    Contact our support team
                  </p>
                </div>
              </div>

              {/* Additional Info Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Booking Information
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Your booking will be confirmed instantly. You'll receive a confirmation email with all the details and check-in instructions.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}