import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const EditHotelModal = ({ isOpen, onClose, hotel, onUpdated }) => {
  const [formData, setFormData] = useState({
    hotelName: "",
    hotelPrice: "",
    hotelLocation: "",
    starRating: 1,
    photoUrl: "",
  });

  // Sync formData with passed hotel prop safely
  useEffect(() => {
    if (hotel) {
      setFormData({
        hotelName: hotel.hotelName || "",
        hotelPrice: hotel.hotelPrice || 0,
        hotelLocation: hotel.hotelLocation || "",
        starRating:
          typeof hotel.starRating === "number" && hotel.starRating >= 1 && hotel.starRating <= 5
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
        // Convert to number or fallback to empty string to avoid NaN
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

    // Basic validation: starRating must be 1-5
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
      const res = await fetch(`https://ass-server-1.onrender.com/hotels/${hotel._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hotelPrice: Number(formData.hotelPrice),
          starRating: Number(formData.starRating),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Hotel updated successfully", "success");
        onUpdated(); // Refresh hotel list or parent state
        onClose(); // Close modal
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
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Hotel</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="hotelName"
            value={formData.hotelName}
            onChange={handleChange}
            placeholder="Hotel Name"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="hotelLocation"
            value={formData.hotelLocation}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            name="hotelPrice"
            value={formData.hotelPrice}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-2 rounded"
            min="0"
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
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="url"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
            placeholder="Photo URL"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
