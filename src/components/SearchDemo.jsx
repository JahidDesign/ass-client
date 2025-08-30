// src/components/SearchDemo.jsx
import React, { useEffect, useState } from "react";

const SearchDemo = () => {
  const [customers, setCustomers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [flights, setFlights] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Fetch all data
  useEffect(() => {
    fetch("https://ass-server-1.onrender.com/customers")
      .then((res) => res.json())
      .then(setCustomers)
      .catch(console.error);

    fetch("https://ass-server-1.onrender.com/hotels")
      .then((res) => res.json())
      .then(setHotels)
      .catch(console.error);

    fetch("https://ass-server-1.onrender.com/tours")
      .then((res) => res.json())
      .then(setTours)
      .catch(console.error);

    fetch("https://ass-server-1.onrender.com/flights")
      .then((res) => res.json())
      .then(setFlights)
      .catch(console.error);
  }, []);

  // Filter results based on query
  useEffect(() => {
    if (!searchQuery) return setSearchResults([]);

    const q = searchQuery.toLowerCase();

    const results = [
      ...customers
        .filter(
          (c) =>
            c.fullName?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q)
        )
        .map((c) => ({ type: "Customer", data: c })),

      ...hotels
        .filter(
          (h) =>
            h.hotelName?.toLowerCase().includes(q) ||
            h.hotelLocation?.toLowerCase().includes(q)
        )
        .map((h) => ({ type: "Hotel", data: h })),

      ...tours
        .filter(
          (t) =>
            t.selectedPackage?.toLowerCase().includes(q) ||
            t.pickupLocation?.toLowerCase().includes(q)
        )
        .map((t) => ({ type: "Tour", data: t })),

      ...flights
        .filter(
          (f) =>
            f.passengerName?.toLowerCase().includes(q) ||
            f.email?.toLowerCase().includes(q)
        )
        .map((f) => ({ type: "Flight", data: f })),
    ];

    setSearchResults(results);
  }, [searchQuery, customers, hotels, tours, flights]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search Demo</h1>
      <input
        type="text"
        placeholder="Search customers, hotels, tours, flights..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {searchResults.length > 0 ? (
        <ul className="space-y-4">
          {searchResults.map((r, idx) => (
            <li
              key={idx}
              className="p-4 border rounded flex items-center gap-4 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={r.data.photoUrl || r.data.customerPhoto || "/default-avatar.png"}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">
                  {r.type === "Customer"
                    ? r.data.fullName
                    : r.type === "Hotel"
                    ? r.data.hotelName
                    : r.type === "Tour"
                    ? r.data.selectedPackage
                    : r.data.passengerName}
                </p>
                <p className="text-sm text-gray-500">
                  {r.type === "Customer"
                    ? r.data.email
                    : r.type === "Hotel"
                    ? r.data.hotelLocation
                    : r.type === "Tour"
                    ? r.data.pickupLocation
                    : r.data.email}
                </p>
                <span className="text-xs text-blue-500">{r.type}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : searchQuery ? (
        <p className="text-gray-500">No results found for "{searchQuery}"</p>
      ) : (
        <p className="text-gray-400">Start typing to search...</p>
      )}
    </div>
  );
};

export default SearchDemo;
