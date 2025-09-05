// src/pages/AllHotelsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaStar,
  FaDollarSign,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.05, y: -8, transition: { duration: 0.3, ease: "easeOut" } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
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
    fetch("https://ass-server-sy-travles.onrender.com/hotels")
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
    const matchesFeature = filterFeature ? hotel.features?.[filterFeature] : true;
    return matchesSearch && matchesFeature;
  });

  // Pagination
  const indexOfLast = currentPage * hotelsPerPage;
  const indexOfFirst = indexOfLast - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  return (
    <div className={`${theme === "dark" ? " text-white" : " text-black"} min-h-screen`}>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="text-center flex-1">
            <h1 className={`${theme === "dark" ? "text-white" : "text-black"} text-5xl font-black`}>
              Discover Hotels
            </h1>
            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} text-lg mt-2 font-medium`}>
              Find your perfect stay from our curated collection
            </p>
          </div>

          {/* Theme Toggle */}
          {/* <motion.button
            onClick={toggleTheme}
            className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} p-3 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-colors duration-300`}
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.9, rotate: -10 }}
          >
            {theme === "dark" ? (
              <FaSun className="text-yellow-400 text-xl" />
            ) : (
              <FaMoon className="text-black text-xl" />
            )}
          </motion.button> */}
        </motion.div>

        {/* Back Link */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link
            to="/"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border shadow-md hover:shadow-lg transition-all duration-300 font-medium ${
              theme === "dark"
                ? "bg-gray-800 border-gray-800 text-gray-300 hover:bg-gray-900"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>←</span> Back to Home
          </Link>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          className="flex flex-col lg:flex-row gap-6 justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by hotel name or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full px-6 py-4 pl-12 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 font-medium placeholder:text-gray-500 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:border-gray-600 focus:ring-gray-600/20 text-white placeholder:text-gray-400"
                  : "bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-300/20 text-black placeholder:text-gray-500"
              }`}
            />
            <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
          </div>

          {/* Filter Dropdown */}
          <div className="relative flex-1">
            <select
              value={filterFeature}
              onChange={(e) => {
                setFilterFeature(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full px-6 py-4 rounded-2xl border-2 appearance-none focus:outline-none focus:ring-4 transition-all duration-300 font-medium ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:border-gray-600 focus:ring-gray-600/20 text-white"
                  : "bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-300/20 text-black"
              }`}
            >
              <option value="">All Features</option>
              <option value="wifi">WiFi Available</option>
              <option value="restaurant">Restaurant</option>
              <option value="parking">Parking</option>
              <option value="conference">Conference Rooms</option>
              <option value="banquet">Banquet Halls</option>
            </select>
            {/* Custom arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg
                className={`w-4 h-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Loading / Empty */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              className="flex items-center space-x-3 text-lg font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className={`w-8 h-8 border-4 rounded-full animate-spin border-t-transparent ${theme === "dark" ? "border-white" : "border-black"}`}></div>
              <span>Loading amazing hotels...</span>
            </motion.div>
          </div>
        ) : currentHotels.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-xl font-medium`}>
              No hotels match your search criteria
            </p>
            <p className={`${theme === "dark" ? "text-gray-500" : "text-gray-400"} mt-2`}>
              Try adjusting your filters or search terms
            </p>
          </motion.div>
        ) : (
          <>
            {/* Results Count */}
            <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} font-medium`}>
                Found {filteredHotels.length} hotel{filteredHotels.length !== 1 ? "s" : ""} • Page {currentPage} of {totalPages}
              </p>
            </motion.div>

            {/* Hotels Grid */}
            <motion.div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" variants={containerVariants} initial="hidden" animate="show">
              {currentHotels.map((hotel) => (
                <motion.div
                  key={hotel._id}
                  className={`group rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col transition-all duration-500 border p-4 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-black"
                  }`}
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={hotel.photoUrl || "https://source.unsplash.com/400x250/?hotel"}
                      alt={hotel.hotelName}
                      className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-2 rounded-xl flex items-center gap-1 shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
                        <FaStar className="text-yellow-500 text-sm" />
                        <span className="text-sm font-bold">{hotel.starRating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="text-xl font-bold mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                        {hotel.hotelName}
                      </h2>

                      <div className="flex items-center gap-2 mb-3">
                        <FaMapMarkerAlt className="text-gray-400 text-sm" />
                        <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} text-sm font-medium`}>
                          {hotel.hotelLocation}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <FaDollarSign className={`${theme === "dark" ? "text-white" : "text-black"} text-sm`} />
                        <p className="text-lg font-bold">
                          ${hotel.hotelPrice}
                          <span className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-sm font-normal ml-1`}>
                            / night
                          </span>
                        </p>
                      </div>

                      <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} text-sm mb-4 line-clamp-2 leading-relaxed`}>
                        {hotel.description?.slice(0, 80)}...
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.features?.wifi && <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}>WiFi</span>}
                        {hotel.features?.restaurant && <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}>Restaurant</span>}
                        {hotel.features?.parking && <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}>Parking</span>}
                        {hotel.features?.conference && <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}>Conference</span>}
                        {hotel.features?.banquet && <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}>Banquet</span>}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <motion.button
                      onClick={() => navigate(`/hotels/${hotel._id}`)}
                      className={`w-full py-3 px-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform ${
                        theme === "dark"
                          ? "bg-white text-black hover:bg-gray-200"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                className="flex justify-center mt-12 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      currentPage === i + 1
                        ? theme === "dark"
                          ? "bg-white text-black shadow-lg scale-110"
                          : "bg-black text-white shadow-lg scale-110"
                        : theme === "dark"
                          ? "bg-black text-gray-300 border border-gray-700 hover:border-gray-600 hover:shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:shadow-md"
                    }`}
                    whileHover={{ scale: currentPage === i + 1 ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
