// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import SearchBar from "../components/secret/SearchBar";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [flights, setFlights] = useState([]);

  // Fetch data
  useEffect(() => {
    fetch("https://ass-server-sy-travles.onrender.com/customers").then(res => res.json()).then(setCustomers).catch(console.error);
    fetch("https://ass-server-sy-travles.onrender.com/hotels").then(res => res.json()).then(setHotels).catch(console.error);
    fetch("https://ass-server-sy-travles.onrender.com/tours").then(res => res.json()).then(setTours).catch(console.error);
    fetch("https://ass-server-sy-travles.onrender.com/flights").then(res => res.json()).then(setFlights).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* SearchBar */}
      <SearchBar customers={customers} hotels={hotels} tours={tours} flights={flights} />

      {/* Customers */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Customers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map(customer => (
            <div
              key={customer._id}
              id={`customer-${customer._id}`}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="font-medium">{customer.fullName}</p>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hotels */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map(hotel => (
            <div
              key={hotel._id}
              id={`hotel-${hotel._id}`}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="font-medium">{hotel.hotelName}</p>
              <p className="text-sm text-gray-500">{hotel.hotelLocation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tours */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Tours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tours.map(tour => (
            <div
              key={tour._id}
              id={`tour-${tour._id}`}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="font-medium">{tour.selectedPackage}</p>
              <p className="text-sm text-gray-500">{tour.pickupLocation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flights */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flights.map(flight => (
            <div
              key={flight._id}
              id={`flight-${flight._id}`}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="font-medium">{flight.passengerName}</p>
              <p className="text-sm text-gray-500">{flight.email}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
