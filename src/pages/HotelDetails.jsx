// src/pages/HotelDetails.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";  // 👈 Added
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

export default function HotelDetails() {
  const { id } = useParams(); // expects Mongo _id as route param
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); // 👈 Get theme (light/dark)

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
        if (r.isConfirmed) navigate("/my-bookings");
      });
    } catch (e) {
      console.error("Booking error:", e);
      MySwal.fire({ icon: "error", title: "Booking failed", text: e.message || "Please try again." });
    }
  };

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-semibold">Hotel not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Go back
        </button>
      </div>
    );
  }

  const mapEmbed = buildMapEmbedSrc(hotel);

  return (
    <motion.div
      className={`max-w-4xl mx-auto p-6 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cover image */}
      <img
        src={hotel.photoUrl || "https://source.unsplash.com/1000x500/?hotel"}
        alt={hotel.hotelName}
        className="w-full h-64 md:h-80 object-cover rounded-2xl shadow"
      />

      {/* Headline */}
      <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{hotel.hotelName}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{hotel.hotelLocation}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-500 text-lg" aria-label="star rating">{stars}</span>
            <span className="text-sm text-gray-500">({hotel.starRating})</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl md:text-2xl font-semibold">
            {hotel.hotelPrice}
            <span className="text-gray-500 text-base"> / night</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-4 flex flex-wrap gap-2">
        {hotel.features?.wifi && <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">📶 Wi-Fi</span>}
        {hotel.features?.restaurant && <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">🍽️ Restaurant</span>}
        {hotel.features?.parking && <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">🅿️ Parking</span>}
        {hotel.features?.conference && <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">🏢 Conference</span>}
        {hotel.features?.banquet && <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">🎉 Banquet</span>}
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {hotel.description || "No description available."}
      </p>

      {/* Map */}
      {mapEmbed && (
        <div className="mt-5">
          {mapEmbed.type === "iframe" ? (
            <iframe
              src={mapEmbed.src}
              title="Hotel Map"
              className="w-full h-64 md:h-80 rounded-2xl border"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <img
              src={mapEmbed.src}
              alt="Hotel map or location"
              className="w-full h-64 md:h-80 object-cover rounded-2xl border"
            />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <motion.button
          whileHover={{ scale: booked ? 1 : 1.03 }}
          whileTap={{ scale: booked ? 1 : 0.97 }}
          onClick={handleBookNow}
          disabled={booked}
          className={`flex-1 py-3 rounded-xl font-semibold text-white transition ${
            booked ? "bg-green-500 cursor-default" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {booked ? "Completed" : "Book Now"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          className="py-3 px-5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
        >
          Back
        </motion.button>
      </div>
    </motion.div>
  );
}
