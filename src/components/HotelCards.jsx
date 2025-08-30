// src/components/HotelCards.jsx
import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { FaStar, FaWifi, FaUtensils, FaParking, FaUsers, FaChair, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const MyHotelCards = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const isDark = theme === "dark";

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    hotelName: "",
    hotelLocation: "",
    description: "",
    starRating: 3,
    hotelPrice: "",
    photoUrl: "",
    mapUrl: "",
    features: { wifi: false, restaurant: false, parking: false, conference: false, banquet: false },
  });

  // Fetch hotels
  useEffect(() => {
    fetch("https://ass-server-1.onrender.com/hotels")
      .then((res) => res.json())
      .then((data) => {
        const userHotels = user ? data.filter((h) => h.userEmail === user.email) : data;
        setHotels(userHotels);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Failed to load hotels", "error");
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in formData.features) {
      setFormData((prev) => ({ ...prev, features: { ...prev.features, [name]: checked } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    }
  };

  // Submit new hotel
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) return;

    const newHotel = {
      ...formData,
      userEmail: user.email,
      userName: user.displayName || "Unknown",
    };

    try {
      const res = await fetch("https://ass-server-1.onrender.com/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHotel),
      });
      if (res.ok) {
        const savedHotel = await res.json();
        setHotels((prev) => [...prev, savedHotel]);
        setFormData({
          hotelName: "",
          hotelLocation: "",
          description: "",
          starRating: 3,
          hotelPrice: "",
          photoUrl: "",
          mapUrl: "",
          features: { wifi: false, restaurant: false, parking: false, conference: false, banquet: false },
        });
        setIsModalOpen(false);
        Swal.fire("Success", "Hotel added successfully!", "success");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add hotel", "error");
    }
  };

  if (loading)
    return (
      <p className={`text-center mt-10 ${isDark ? "text-gray-100" : "text-gray-900"}`}>Loading hotels...</p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Heading & Add Hotel Button */}
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent 
            bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600
            animate-text-shimmer">
          My Hotels Dashboard
        </h1>
        <p className={`mt-3 text-lg md:text-xl ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          All your hotel listings, managed in one place.
        </p>
        <div className="w-28 h-1 mx-auto mt-5 rounded-full bg-gradient-to-r from-yellow-500 to-purple-600 shadow-lg animate-pulse"></div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-5 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto"
        >
          <FaPlus /> Add Hotel
        </button>
      </div>

      {/* Add Hotel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`w-full max-w-lg p-6 rounded-xl shadow-lg ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h2 className="text-xl font-bold mb-4">Add New Hotel</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
                placeholder="Hotel Name"
                className="input input-bordered w-full p-2 rounded"
                required
              />
              <input
                type="text"
                name="hotelLocation"
                value={formData.hotelLocation}
                onChange={handleChange}
                placeholder="Location"
                className="input input-bordered w-full p-2 rounded"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="textarea textarea-bordered w-full p-2 rounded"
                required
              ></textarea>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="starRating"
                  value={formData.starRating}
                  onChange={handleChange}
                  min={1}
                  max={5}
                  placeholder="Star Rating"
                  className="input input-bordered w-full p-2 rounded"
                  required
                />
                <input
                  type="number"
                  name="hotelPrice"
                  value={formData.hotelPrice}
                  onChange={handleChange}
                  placeholder="Price per night"
                  className="input input-bordered w-full p-2 rounded"
                  required
                />
              </div>
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="Image URL"
                className="input input-bordered w-full p-2 rounded"
                required
              />
              <input
                type="url"
                name="mapUrl"
                value={formData.mapUrl}
                onChange={handleChange}
                placeholder="Google Map URL"
                className="input input-bordered w-full p-2 rounded"
              />
              {/* Features */}
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                {["wifi", "restaurant", "parking", "conference", "banquet"].map((feature) => (
                  <label key={feature} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name={feature}
                      checked={formData.features[feature]}
                      onChange={handleChange}
                      className="checkbox"
                    />
                    {feature.charAt(0).toUpperCase() + feature.slice(1)}
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hotel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.length === 0 && (
          <p className={`col-span-full text-center text-lg ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            No hotels found for your account.
          </p>
        )}
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className={`rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 duration-300 ${isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
          >
            <img src={hotel.photoUrl} alt={hotel.hotelName} className="w-full h-56 object-cover" />
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold">{hotel.hotelName}</h3>
              <p className="text-gray-500">{hotel.hotelLocation}</p>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`text-yellow-400 ${i < hotel.starRating ? "" : "text-gray-400"}`} />
                ))}
              </div>
              <p className="text-sm mt-2 line-clamp-3">{hotel.description}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-sm">
                {hotel.features.wifi && <span className="flex items-center gap-1"><FaWifi /> WiFi</span>}
                {hotel.features.restaurant && <span className="flex items-center gap-1"><FaUtensils /> Restaurant</span>}
                {hotel.features.parking && <span className="flex items-center gap-1"><FaParking /> Parking</span>}
                {hotel.features.conference && <span className="flex items-center gap-1"><FaUsers /> Conference</span>}
                {hotel.features.banquet && <span className="flex items-center gap-1"><FaChair /> Banquet</span>}
              </div>
              {hotel.mapUrl && (
                <a href={hotel.mapUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline text-sm">
                  View on Map
                </a>
              )}
              <p className="font-semibold mt-3">${hotel.hotelPrice} / night</p>
              <p className="text-sm mt-2 text-gray-400">
                Created by: <span className="text-gray-200 font-medium">{hotel.userName || "Unknown"}</span> ({hotel.userEmail})
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotelCards;
