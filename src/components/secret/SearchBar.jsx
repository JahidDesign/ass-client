// src/components/secret/SearchBar.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

const SearchBar = ({ customers = [], hotels = [], tours = [], flights = [] }) => {
  const { theme } = useContext(ThemeContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter results dynamically
  useEffect(() => {
    if (!query) return setResults([]);
    const q = query.toLowerCase();

    const filtered = [
      ...customers
        .filter(c => c.fullName?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q))
        .map(c => ({ type: "Customer", data: c })),
      ...hotels
        .filter(h => h.hotelName?.toLowerCase().includes(q) || h.hotelLocation?.toLowerCase().includes(q))
        .map(h => ({ type: "Hotel", data: h })),
      ...tours
        .filter(t => t.selectedPackage?.toLowerCase().includes(q) || t.pickupLocation?.toLowerCase().includes(q))
        .map(t => ({ type: "Tour", data: t })),
      ...flights
        .filter(f => f.passengerName?.toLowerCase().includes(q) || f.email?.toLowerCase().includes(q))
        .map(f => ({ type: "Flight", data: f }))
    ];

    setResults(filtered.slice(0, 8));
  }, [query, customers, hotels, tours, flights]);

  // Navigate to corresponding ID route
  const handleClickResult = (result) => {
    const pathMap = {
      Customer: `/customers/${result.data._id}`,
      Hotel: `/hotels/${result.data._id}`,
      Tour: `/tours/${result.data._id}`,
      Flight: `/flights/${result.data._id}`
    };
    const path = pathMap[result.type];
    if (path) navigate(path);

    setQuery("");
    setResults([]);
    setFocused(false);
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div
        className={`flex items-center gap-2 border rounded-lg px-3 py-1 cursor-pointer transition-shadow hover:shadow-md ${
          theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-300"
        }`}
      >
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          className="w-full outline-none bg-transparent"
        />
        <FaSearch className="text-gray-400" />
      </div>

      {/* Animated Dropdown */}
      <AnimatePresence>
        {focused && results.length > 0 && (
          <motion.div
            className={`absolute top-full left-0 w-full mt-1 max-h-64 overflow-y-auto rounded-lg shadow-lg border z-50 ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {results.map((result, idx) => (
              <motion.div
                key={idx}
                className="flex items-center px-3 py-2 gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleClickResult(result)}
              >
                <img
                  src={result.data.photoUrl || result.data.customerPhoto || "/default-avatar.png"}
                  alt=""
                  className="w-8 h-8 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {result.type === "Customer"
                      ? result.data.fullName
                      : result.type === "Hotel"
                      ? result.data.hotelName
                      : result.type === "Tour"
                      ? result.data.selectedPackage
                      : result.data.passengerName}
                  </p>
                  <p className="text-xs text-gray-500">{result.type}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
