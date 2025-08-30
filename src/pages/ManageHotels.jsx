// src/pages/ManageHotelPackages.jsx
import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import EditHotelModal from "./EditHotelModal";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaWifi,
  FaUtensils,
  FaParking,
  FaUsers,
  FaChair,
} from "react-icons/fa";

const ManageHotelPackages = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editHotel, setEditHotel] = useState(null);

  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  useEffect(() => {
    fetchHotels();
  }, [user]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://ass-server-1.onrender.com/hotels");
      const data = await res.json();
      // ✅ Filter hotels created by the logged-in user
      const userHotels = user
        ? data.filter((h) => h.userEmail === user.email)
        : [];
      setHotels(userHotels);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch hotels.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(
          `https://ass-server-1.onrender.com/hotels/${id}`,
          {
            method: "DELETE",
          }
        );
        const result = await res.json();
        if (res.ok) {
          Swal.fire("Deleted!", "Hotel deleted successfully.", "success");
          fetchHotels();
        } else {
          Swal.fire("Error", result.error || "Delete failed", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete the hotel.", "error");
      }
    }
  };

  if (loading)
    return (
      <p
        className={`text-center mt-10 ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Loading hotels...
      </p>
    );
  if (hotels.length === 0)
    return (
      <p
        className={`text-center mt-10 ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        No hotels found for your account.
      </p>
    );

  return (
    <div
      className={`min-h-screen p-6 max-w-7xl mx-auto ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-pulse">
        My Hotels
      </h1>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl shadow">
        <table
          className={`w-full border rounded-xl shadow ${
            isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <thead className={isDark ? "bg-gray-700" : "bg-green-100"}>
            <tr>
              <th className="p-3">Photo</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Location</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stars</th>
              <th className="p-3">Features</th>
              <th className="p-3">Created By</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr
                key={hotel._id}
                className={`border-b transition duration-200 hover:bg-green-50 ${
                  isDark ? "hover:bg-gray-700 border-gray-700" : ""
                }`}
              >
                <td className="p-3">
                  <img
                    src={hotel.photoUrl}
                    alt={hotel.hotelName}
                    className="w-24 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3 font-semibold">{hotel.hotelName}</td>
                <td className="p-3 text-sm max-w-xs truncate">
                  {hotel.description}
                </td>
                <td className="p-3">{hotel.hotelLocation}</td>
                <td className="p-3 font-semibold">${hotel.hotelPrice}</td>
                <td className="p-3 text-yellow-500">
                  {"★".repeat(hotel.starRating || 0)}
                </td>
                <td className="p-3 flex flex-wrap gap-2 text-sm">
                  {hotel.features?.wifi && (
                    <span className="flex items-center gap-1">
                      <FaWifi /> WiFi
                    </span>
                  )}
                  {hotel.features?.restaurant && (
                    <span className="flex items-center gap-1">
                      <FaUtensils /> Restaurant
                    </span>
                  )}
                  {hotel.features?.parking && (
                    <span className="flex items-center gap-1">
                      <FaParking /> Parking
                    </span>
                  )}
                  {hotel.features?.conference && (
                    <span className="flex items-center gap-1">
                      <FaUsers /> Conference
                    </span>
                  )}
                  {hotel.features?.banquet && (
                    <span className="flex items-center gap-1">
                      <FaChair /> Banquet
                    </span>
                  )}
                </td>
                <td className="p-3 text-sm">
                  <p className="font-medium">{user?.displayName || "Unknown"}</p>
                  <p className="text-xs text-gray-500">{hotel.userEmail}</p>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => setEditHotel(hotel)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className={`rounded-xl shadow p-4 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <img
              src={hotel.photoUrl}
              alt={hotel.hotelName}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h2 className="text-lg font-semibold">{hotel.hotelName}</h2>
            <p className="text-sm opacity-80">{hotel.description}</p>
            <p className="text-sm opacity-80">📍 {hotel.hotelLocation}</p>
            <p className="text-sm opacity-80">💰 ${hotel.hotelPrice}</p>
            <p className="text-yellow-500">
              {"★".repeat(hotel.starRating || 0)}
            </p>
            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              {hotel.features?.wifi && (
                <span className="flex items-center gap-1">
                  <FaWifi /> WiFi
                </span>
              )}
              {hotel.features?.restaurant && (
                <span className="flex items-center gap-1">
                  <FaUtensils /> Restaurant
                </span>
              )}
              {hotel.features?.parking && (
                <span className="flex items-center gap-1">
                  <FaParking /> Parking
                </span>
              )}
              {hotel.features?.conference && (
                <span className="flex items-center gap-1">
                  <FaUsers /> Conference
                </span>
              )}
              {hotel.features?.banquet && (
                <span className="flex items-center gap-1">
                  <FaChair /> Banquet
                </span>
              )}
            </div>
            <div className="mt-3 text-sm">
              <p className="font-medium">{user?.displayName || "Unknown"}</p>
              <p className="text-xs text-gray-500">{hotel.userEmail}</p>
            </div>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => setEditHotel(hotel)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(hotel._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <EditHotelModal
        isOpen={!!editHotel}
        hotel={editHotel}
        onClose={() => setEditHotel(null)}
        onUpdated={fetchHotels}
      />
    </div>
  );
};

export default ManageHotelPackages;
