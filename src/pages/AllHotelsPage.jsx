// src/pages/AllHotelsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { scale: 1.03, transition: { duration: 0.3 } },
};

const AllHotelsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      {/* Page Heading */}
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-700">
        All Available Hotels
      </h1>

      {/* Back to Home Link */}
      <div className="text-center mb-6">
        <Link
          to="/"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm transition"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Loading state */}
      {loading ? (
        <p className="text-center text-lg">Loading hotels...</p>
      ) : hotels.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No hotels available.</p>
      ) : (
        <motion.div
          className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {hotels.map((hotel) => (
            <motion.div
              key={hotel._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
              variants={cardVariants}
              whileHover="hover"
            >
              {/* Hotel Image */}
              <img
                src={hotel.photoUrl || "https://source.unsplash.com/400x250/?hotel"}
                alt={hotel.hotelName}
                className="h-48 w-full object-cover"
              />

              {/* Hotel Info */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{hotel.hotelName}</h2>
                  <p className="text-sm text-gray-600 mt-1">{hotel.hotelLocation}</p>
                  <p className="text-sm text-gray-600">
                    <strong>${hotel.hotelPrice}</strong> / night
                  </p>
                  <p className="text-yellow-500 text-sm mb-2">Rating: {hotel.starRating} ★</p>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {hotel.description?.slice(0, 80)}...
                  </p>

                  {/* Features */}
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

                {/* Show Details Button */}
                <button
                  onClick={() => navigate(`/hotels/${hotel._id}`)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  Show Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AllHotelsPage;
