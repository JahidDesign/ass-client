// src/pages/ToursList.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

const TourCard = ({ tour }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl border overflow-hidden flex flex-col"
    >
      {/* Tour Image */}
      <div className="relative">
        <img
          src={tour.photo || "https://placehold.co/600x400"}
          alt={tour.selectedPackage}
          className="w-full h-52 md:h-64 object-cover"
        />
        <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded shadow">
          {tour.selectedPackage.toUpperCase()}
        </span>
      </div>

      {/* Tour Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 capitalize">
          {tour.selectedPackage} Package
        </h3>
        <p className="text-sm text-gray-500 mb-1">
          Pickup: {tour.pickupLocation}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          Travel: {new Date(tour.travelDate).toLocaleDateString()} →{" "}
          {new Date(tour.returnDate).toLocaleDateString()}
        </p>
        <p className="text-yellow-600 font-extrabold text-lg mb-2">
          ${tour.totalPrice}
        </p>
        <p className="text-gray-600 text-sm line-clamp-3 whitespace-pre-line mb-4">
          {tour.specialRequests || "No special notes."}
        </p>

        {/* Details Button */}
        <Link
          to={`/tours/${tour._id}`}
          className="mt-auto py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-semibold transition"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

const ToursList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch("https://ass-server-1.onrender.com/tours")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tours");
        return res.json();
      })
      .then((data) => {
        setTours(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load tours. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading tours...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-medium">
        {error}
      </div>
    );

  if (tours.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        No tours available.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Title */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-700 text-center mb-12">
        Explore Our Tour Packages
      </h2>

      {/* Tours Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {tours.map((tour) => (
          <TourCard key={tour._id} tour={tour} />
        ))}
      </motion.div>

      {/* Show More */}
      {tours.length > 6 && (
        <div className="text-center mt-12">
          <Link
            to="/all-packages"
            className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition"
          >
            Show More Tours →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ToursList;
