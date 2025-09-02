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
// Banner Component
// -------------------
const ToursBanner = ({ tour }) => {
  if (!tour) return null;
  return (
    <div
      className="w-full h-40 md:h-48 relative flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${tour.photoUrl || tour.photo || "https://placehold.co/1200x800"})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative text-center text-white px-4">
        <h1 className="text-lg md:text-2xl font-bold mb-1">{tour.title || tour.selectedPackage}</h1>
        <p className="text-sm md:text-lg">{tour.location || tour.pickupLocation}</p>
      </div>
    </div>
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
      title: tour.title || tour.selectedPackage || "Tour Package",
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
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  );

  if (!tour) return (
    <div className={`max-w-4xl mx-auto p-6 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
      <p>No tour found.</p>
      <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Go Back</button>
    </div>
  );

  const mapEmbed = buildMapEmbed(tour.mapUrl);

  return (
    <div className={`max-w-6xl mx-auto p-6 mt-2 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Banner */}
      <ToursBanner tour={tour} />

      {/* Details */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden mt-4`}
      >
        <div className="md:flex">
          {/* Left Image */}
          <div className="md:w-1/2 relative h-80 md:h-full">
            <img src={tour.photoUrl || tour.photo || "https://placehold.co/1200x800"} alt={tour.title} className="w-full h-80 md:h-full object-cover"/>
            <div className="absolute left-4 bottom-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-3 py-1 rounded-lg shadow">
              <p className="text-sm font-semibold">{tour.duration || "Flexible"}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{tour.category || tour.selectedPackage || "General"}</p>
            </div>
          </div>

          {/* Right Details */}
          <div className="md:w-1/2 p-6 space-y-4 text-gray-900 dark:text-gray-200">
            <h1 className="text-2xl md:text-3xl font-bold">{tour.title || tour.selectedPackage}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{tour.location || tour.pickupLocation}</p>

            {/* Dates */}
            <p className="text-sm">
              <strong>Travel:</strong> {formatDate(tour.travelDate)} - {formatDate(tour.returnDate)}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mt-2">
              {tour.features?.hotel && <span className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">Hotel</span>}
              {tour.features?.car && <span className="bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">Car</span>}
              {tour.features?.boat && <span className="bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs">Boat</span>}
              {tour.features?.restaurant && <span className="bg-pink-100 dark:bg-pink-700 text-pink-800 dark:text-pink-200 px-2 py-1 rounded text-xs">Restaurant</span>}
            </div>

            {/* Booking buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleBooking}
                disabled={booking || alreadyBooked}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  alreadyBooked ? "bg-green-500 cursor-default" :
                  booking ? "bg-blue-400 cursor-wait" :
                  "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                } text-white`}
              >
                {alreadyBooked ? "Completed" : booking ? "Booking..." : "Book Now"}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="py-3 px-5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              >
                Back
              </button>
            </div>

            {/* Map / Image */}
            {mapEmbed && (
              <div className="mt-4 overflow-hidden rounded-lg border">
                {mapEmbed.type === "iframe" ? (
                  <iframe src={mapEmbed.src} title="Tour Map" className="w-full h-48" loading="lazy" />
                ) : (
                  <img src={mapEmbed.src} alt="Tour Map" className="w-full h-48 object-cover" />
                )}
              </div>
            )}

            {/* Special Requests */}
            {tour.specialRequests && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-200 text-sm whitespace-pre-line">
                <strong>Special Requests:</strong>
                <p>{tour.specialRequests}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
