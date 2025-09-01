// src/pages/HotelsPage.jsx
import React, { useState, useEffect } from "react";

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("https://ass-server-sy-travles.onrender.com/hotels");
        if (!response.ok) throw new Error("Failed to fetch hotels");
        const data = await response.json();
        setHotels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Combined filter logic
  const filteredHotels = hotels.filter(hotel => {
    const matchesName = hotel.hotelName.toLowerCase().includes(searchName.toLowerCase());
    const matchesLocation = hotel.hotelLocation.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesPrice = maxPrice ? Number(hotel.hotelPrice) <= Number(maxPrice) : true;
    return matchesName && matchesLocation && matchesPrice;
  });

  if (loading) return <p className="p-4">Loading hotels...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (hotels.length === 0) return <p className="p-4">No hotels found.</p>;

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Search by location"
          value={searchLocation}
          onChange={e => setSearchLocation(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
      </div>

      {/* Hotel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredHotels.length > 0 ? (
          filteredHotels.map(hotel => (
            <div
              key={hotel._id}
              id={`hotel-${hotel._id}`}
              className="card border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={hotel.photoUrl || "/default-hotel.png"}
                alt={hotel.hotelName}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="font-bold text-lg mt-2">{hotel.hotelName}</h3>
              <p className="text-gray-500">{hotel.hotelLocation}</p>
              <p className="text-gray-700 font-semibold">${hotel.hotelPrice}</p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3">No hotels match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;
