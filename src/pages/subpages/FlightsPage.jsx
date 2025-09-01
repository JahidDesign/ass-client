// src/pages/FlightsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const FlightsPage = () => {
  const { theme } = useContext(ThemeContext);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(
          "https://ass-server-sy-travles.onrender.com/flights"
        );
        if (!response.ok) throw new Error("Failed to fetch flights");
        const data = await response.json();
        setFlights(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading)
    return (
      <p
        className={`p-4 ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Loading flights...
      </p>
    );
  if (error)
    return (
      <p className="p-4 text-red-500">
        Error: {error}
      </p>
    );
  if (flights.length === 0)
    return (
      <p
        className={`p-4 ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        No flights found.
      </p>
    );

  return (
    <div
      className={`min-h-screen p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-colors ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {flights.map((flight) => (
        <div
          key={flight._id}
          id={`flight-${flight._id}`}
          className={`rounded-2xl shadow-lg overflow-hidden border transition hover:scale-105 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Passenger Photo */}
          <img
            src={flight.customerPhoto || "/default-avatar.png"}
            alt={flight.passengerName}
            className="w-full h-40 object-cover"
          />

          {/* Flight Info */}
          <div className="p-4">
            <h3 className="font-bold text-lg">{flight.passengerName}</h3>
            <p className="text-gray-500 dark:text-gray-400">{flight.email}</p>
            <p className="text-gray-500 dark:text-gray-400">
              {flight.airlineName}
            </p>

            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {flight.departure} → {flight.arrival} | {flight.departureDate}
            </p>

            <p className="text-sm text-gray-400 dark:text-gray-500">
              Class: {flight.travelClass}, Seat: {flight.seatPreference}
            </p>

            <p className="text-sm text-gray-400 dark:text-gray-500">
              Price: {flight.offerPrice || flight.regularPrice} (
              {flight.priceType})
            </p>

            <p className="text-sm text-gray-400 dark:text-gray-500">
              Ticket: {flight.ticketNumber}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlightsPage;
