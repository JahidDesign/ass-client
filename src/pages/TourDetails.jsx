// src/pages/TourDetails.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

// -------------------
// Format date helper
// -------------------
const formatDate = (d) => {
  if (!d) return "TBA";
  try {
    const date = new Date(d);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return d;
  }
};

// -------------------
// Map Embed Helper
// -------------------
const buildMapEmbed = (mapUrl) => {
  if (!mapUrl) return null;

  const isImage = /\.(jpg|jpeg|png|webp|i\.ibb\.co)$/i.test(mapUrl);
  if (isImage) return { type: "image", src: mapUrl };

  // If it's already an embed link
  if (/\/embed\?/i.test(mapUrl)) return { type: "iframe", src: mapUrl };

  // Google Maps share link
  if (/maps\.app\.goo\.gl|google\.com\/maps/i.test(mapUrl)) {
    const q = encodeURIComponent(mapUrl);
    return { type: "iframe", src: `https://www.google.com/maps?q=${q}&output=embed` };
  }

  return { type: "iframe", src: mapUrl };
};

// -------------------
// Enhanced Banner Component
// -------------------
const ToursBanner = ({ tour }) => {
  if (!tour) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-64 md:h-80 relative flex items-center justify-center bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl"
      style={{ backgroundImage: `url(${tour.photoUrl || tour.photo || "https://placehold.co/1200x800"})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      
      {/* Content */}
      <div className="relative text-center text-white px-6 z-10">
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg"
        >
          {tour.title || tour.selectedPackage}
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {tour.location || tour.pickupLocation}
        </motion.p>
      </div>
      
      {/* Price badge */}
      {(tour.price || tour.totalPrice) && (
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full shadow-lg"
        >
          <span className="text-sm font-medium">From</span>
          <div className="text-xl font-bold">${tour.price || tour.totalPrice}</div>
        </motion.div>
      )}
    </motion.div>
  );
};

// -------------------
// Main Component
// -------------------
export default function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [alreadyBooked, setAlreadyBooked] = useState(false);

  // Fetch tour
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`https://ass-server-sy-travles.onrender.com/tours/${id}`)
      .then((res) => res.json())
      .then((data) => !cancelled && setTour(data))
      .catch((err) => console.error(err))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  // Check existing booking
  useEffect(() => {
    if (!user) return;
    fetch(`https://ass-server-sy-travles.onrender.com/bookings?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        const booked = data.some((b) => String(b.tourId) === String(id) && b.userEmail === user.email);
        setAlreadyBooked(booked);
      })
      .catch((err) => console.error(err));
  }, [id, user]);

  // Booking handler
  const handleBooking = async () => {
    if (!user) {
      const result = await MySwal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first to book this tour.",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
      });
      if (result.isConfirmed) navigate("/login");
      return;
    }

    if (alreadyBooked) return;

    setBooking(true);

    const bookingData = {
      tourId: tour._id || id,
      title: tour.title || "Tour Title",
      tour :tour.selectedPackage || "Tour Package",
      photoUrl: tour.photoUrl || tour.photo || "",
      price: tour.price || tour.totalPrice || 0,
      location: tour.location || tour.pickupLocation || "Unknown",
      pickupLocation: tour.pickupLocation || "TBD",
      travelDate: tour.travelDate,
      returnDate: tour.returnDate,
      specialRequests: tour.specialRequests,
      mapUrl: tour.mapUrl || "",
      features: tour.features || {},
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || "Anonymous",
      userPhoto: user.photoURL || "",
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch("https://ass-server-sy-travles.onrender.com/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) throw new Error("Booking failed");
      await res.json();
      setAlreadyBooked(true);
      await MySwal.fire({
        icon: "success",
        title: "Booking Confirmed!",
        text: "Your tour has been successfully booked.",
        confirmButtonText: "Go to My Bookings",
      });
      navigate("/myallbookings");
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: "error",
        title: "Booking Failed",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-64 md:h-80 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!tour) return (
    <div className={`max-w-4xl mx-auto p-6 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Tour Not Found</h2>
        <p className="mb-6">Sorry, we couldn't find the tour you're looking for.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  const mapEmbed = buildMapEmbed(tour.mapUrl);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}>
      <div className="max-w-7xl mx-auto p-6 pt-8">
        {/* Enhanced Banner */}
        <ToursBanner tour={tour} />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-8"
        >
          {/* Left Column - Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="relative h-96 group">
                <img 
                  src={tour.photoUrl || tour.photo || "https://placehold.co/1200x800"} 
                  alt={tour.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-bold text-gray-900 dark:text-white">{tour.duration || "Flexible Duration"}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tour.category || tour.selectedPackage || "Adventure Tour"}</p>
                  </div>
                </div>
              </div>
              
              {/* Tour Description Section */}
              <div className="p-6 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {tour.title || "Tour Title"}
                  </h1>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {tour.selectedPackage || "Tour Package"}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {tour.location || tour.pickupLocation}
                  </p>
                </div>

                {/* Travel Dates */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold">Travel Period</p>
                      <p className="text-sm">{formatDate(tour.travelDate)} - {formatDate(tour.returnDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Features */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    What's Included
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {tour.features?.hotel && (
                      <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Hotel Stay</span>
                      </div>
                    )}
                    {tour.features?.car && (
                      <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 5a1 1 0 011 1v1.586l4.707-4.707a1 1 0 011.414 1.414L10.414 9H12a1 1 0 110 2H6a1 1 0 01-1-1V6a1 1 0 011-1h2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">Transportation</span>
                      </div>
                    )}
                    {tour.features?.boat && (
                      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Boat Tour</span>
                      </div>
                    )}
                    {tour.features?.restaurant && (
                      <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-700">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Meals</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map Section */}
                {mapEmbed && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Location
                    </h3>
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                      {mapEmbed.type === "iframe" ? (
                        <iframe 
                          src={mapEmbed.src} 
                          title="Tour Map" 
                          className="w-full h-64" 
                          loading="lazy" 
                        />
                      ) : (
                        <img 
                          src={mapEmbed.src} 
                          alt="Tour Map" 
                          className="w-full h-64 object-cover" 
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
                {/* Price */}
                {(tour.price || tour.totalPrice) && (
                  <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                    <p className="text-sm opacity-90">Total Price</p>
                    <p className="text-3xl font-bold">${tour.price || tour.totalPrice}</p>
                    <p className="text-sm opacity-90">per person</p>
                  </div>
                )}

                {/* Booking Status */}
                <div className="space-y-4 mb-6">
                  {alreadyBooked && (
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
                  <button
                    onClick={handleBooking}
                    disabled={booking || alreadyBooked}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
                      alreadyBooked 
                        ? "bg-green-500 text-white cursor-default shadow-green-200 dark:shadow-green-900" :
                      booking 
                        ? "bg-blue-400 text-white cursor-wait" :
                        "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-200 dark:shadow-blue-900 hover:shadow-xl"
                    }`}
                  >
                    {alreadyBooked ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Booking Completed
                      </span>
                    ) : booking ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Book This Tour
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => navigate(-1)}
                    className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-all duration-200 hover:shadow-lg"
                  >
                    ← Go Back
                  </button>
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Questions about this tour?
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 text-center font-medium">
                    Contact our support team
                  </p>
                </div>
              </div>

              {/* Special Requests */}
              {tour.specialRequests && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Special Requests
                  </h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {tour.specialRequests}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}