// src/pages/ToursPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const ToursPage = () => {
  const { theme } = useContext(ThemeContext);
  const [tours, setTours] = useState([]);

  // Fetch tours from backend
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("https://ass-server-sy-travles.onrender.com/tours");
        const data = await res.json();
        setTours(data);
      } catch (err) {
        console.error("Error fetching tours:", err);
      }
    };
    fetchTours();
  }, []);

  return (
    <div
      className={`min-h-screen p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-colors ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {tours.map((tour) => (
        <div
          key={tour._id}
          id={`tour-${tour._id}`}
          className={`rounded-2xl shadow-lg overflow-hidden border transition hover:scale-105 ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          {/* Tour Image */}
          <img
            src={tour.photo}
            alt={tour.pickupLocation}
            className="w-full h-48 object-cover"
          />

          {/* Tour Info */}
          <div className="p-4">
            <h3 className="font-bold text-xl capitalize">
              {tour.selectedPackage} Package
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {tour.pickupLocation}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Travel: {tour.travelDate} → {tour.returnDate}
            </p>
            <p className="mt-2 text-sm">
              {tour.specialRequests?.slice(0, 80)}...
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.keys(tour.features).map(
                (f) =>
                  tour.features[f] && (
                    <span
                      key={f}
                      className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-100"
                    >
                      {f}
                    </span>
                  )
              )}
            </div>

            {/* Price + Map */}
            <div className="mt-4 flex justify-between items-center">
              <span className="font-bold text-lg">${tour.totalPrice}</span>
              <a
                href={tour.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Map
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToursPage;
