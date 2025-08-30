// src/pages/AllHotelsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaSun, FaMoon } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { scale: 1.03, transition: { duration: 0.3 } },
};

export default function AllHotelsPage() {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterFeature, setFilterFeature] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 8;

  // Fetch hotels
  useEffect(() => {
    fetch("https://ass-server-1.onrender.com/hotels")
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hotels:", err);
        setLoading(false);
      });
  }, []);

  // Filter & Search
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.hotelName.toLowerCase().includes(search.toLowerCase()) ||
      hotel.hotelLocation.toLowerCase().includes(search.toLowerCase());
    const matchesFeature = filterFeature
      ? hotel.features?.[filterFeature]
      : true;
    return matchesSearch && matchesFeature;
  });

  // Pagination
  const indexOfLast = currentPage * hotelsPerPage;
  const indexOfFirst = indexOfLast - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700 dark:text-yellow-400">
            All Available Hotels
          </h1>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Back Link */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-block bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-md text-sm transition"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
            />
            <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
          </div>

          <div className="relative flex-1">
            <select
              value={filterFeature}
              onChange={(e) => {
                setFilterFeature(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
            >
              <option value="">Filter by Feature</option>
              <option value="wifi">WiFi</option>
              <option value="restaurant">Restaurant</option>
              <option value="parking">Parking</option>
              <option value="conference">Conference</option>
              <option value="banquet">Banquet</option>
            </select>
            <FaFilter className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Loading / Empty */}
        {loading ? (
          <p className="text-center text-lg">Loading hotels...</p>
        ) : currentHotels.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No hotels found.
          </p>
        ) : (
          <motion.div
            className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {currentHotels.map((hotel) => (
              <motion.div
                key={hotel._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col"
                variants={cardVariants}
                whileHover="hover"
              >
                <img
                  src={
                    hotel.photoUrl || "https://source.unsplash.com/400x250/?hotel"
                  }
                  alt={hotel.hotelName}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {hotel.hotelName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {hotel.hotelLocation}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>${hotel.hotelPrice}</strong> / night
                    </p>
                    <p className="text-yellow-500 text-sm mb-2">
                      Rating: {hotel.starRating} ★
                    </p>
                    <p className="text-gray-700 dark:text-gray-400 text-sm line-clamp-3">
                      {hotel.description?.slice(0, 80)}...
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {hotel.features?.wifi && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          WiFi
                        </span>
                      )}
                      {hotel.features?.restaurant && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          Restaurant
                        </span>
                      )}
                      {hotel.features?.parking && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          Parking
                        </span>
                      )}
                      {hotel.features?.conference && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          Conference
                        </span>
                      )}
                      {hotel.features?.banquet && (
                        <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                          Banquet
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/hotels/${hotel._id}`)}
                      className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                    >
                      Show Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
