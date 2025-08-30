import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { ThemeContext } from "../context/ThemeContext"; // ✅ Import ThemeContext

const EditHotelModal = ({ isOpen, onClose, hotel, onUpdated }) => {
  const [formData, setFormData] = useState({
    hotelName: "",
    hotelPrice: "",
    hotelLocation: "",
    starRating: 1,
    photoUrl: "",
  });

  const { theme } = useContext(ThemeContext); // ✅ Access theme (light/dark)

  // Sync formData with passed hotel prop safely
  useEffect(() => {
    if (hotel) {
      setFormData({
        hotelName: hotel.hotelName || "",
        hotelPrice: hotel.hotelPrice || 0,
        hotelLocation: hotel.hotelLocation || "",
        starRating:
          typeof hotel.starRating === "number" &&
          hotel.starRating >= 1 &&
          hotel.starRating <= 5
            ? hotel.starRating
            : 1,
        photoUrl: hotel.photoUrl || "",
      });
    }
  }, [hotel]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      let val = value;

      if (type === "number") {
        val = value === "" ? "" : Number(value);
      }
      return {
        ...prev,
        [name]: val,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hotel || !hotel._id) {
      Swal.fire("Error", "Invalid hotel data", "error");
      return;
    }

    if (
      !formData.hotelName.trim() ||
      !formData.hotelLocation.trim() ||
      !formData.hotelPrice ||
      formData.starRating < 1 ||
      formData.starRating > 5
    ) {
      Swal.fire("Error", "Please fill all required fields correctly", "error");
      return;
    }

    try {
      const res = await fetch(
        `https://ass-server-1.onrender.com/hotels/${hotel._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            hotelPrice: Number(formData.hotelPrice),
            starRating: Number(formData.starRating),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Hotel updated successfully", "success");
        onUpdated();
        onClose();
      } else {
        Swal.fire("Error", data.error || "Failed to update", "error");
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Error", "Server error occurred", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg w-full max-w-md transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-4 text-center ${
            theme === "dark" ? "text-yellow-400" : "text-blue-700"
          }`}
        >
          Edit Hotel
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="hotelName"
            value={formData.hotelName}
            onChange={handleChange}
            placeholder="Hotel Name"
            className={`w-full border p-2 rounded ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
            required
          />
          <input
            type="text"
            name="hotelLocation"
            value={formData.hotelLocation}
            onChange={handleChange}
            placeholder="Location"
            className={`w-full border p-2 rounded ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
            required
          />
          <input
            type="number"
            name="hotelPrice"
            value={formData.hotelPrice}
            onChange={handleChange}
            placeholder="Price"
            min="0"
            className={`w-full border p-2 rounded ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
            required
          />
          <input
            type="number"
            name="starRating"
            value={formData.starRating}
            onChange={handleChange}
            placeholder="Star Rating (1-5)"
            min="1"
            max="5"
            className={`w-full border p-2 rounded ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
            required
          />
          <input
            type="url"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
            placeholder="Photo URL"
            className={`w-full border p-2 rounded ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded transition ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-black"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded transition ${
                theme === "dark"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotelModal;
