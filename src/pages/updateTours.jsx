import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { ThemeContext } from "../context/ThemeContext";

const EditTourModal = ({ isOpen, onClose, tour, onUpdated }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    selectedPackage: "",
    travelDate: "",
    returnDate: "",
    pickupLocation: "",
    specialRequests: "",
    photo: "",
    mapUrl: "",
    totalPrice: "",
    features: {
      hotel: false,
      car: false,
      boat: false,
      restaurant: false,
    },
  });

  // Sync with passed tour
  useEffect(() => {
    if (tour) {
      setFormData({
        selectedPackage: tour.selectedPackage || "",
        travelDate: tour.travelDate || "",
        returnDate: tour.returnDate || "",
        pickupLocation: tour.pickupLocation || "",
        specialRequests: tour.specialRequests || "",
        photo: tour.photo || "",
        mapUrl: tour.mapUrl || "",
        totalPrice: tour.totalPrice || "",
        features: tour.features || {
          hotel: false,
          car: false,
          boat: false,
          restaurant: false,
        },
      });
    }
  }, [tour]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in formData.features) {
      setFormData((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tour || !tour._id) {
      Swal.fire("Error", "Invalid tour data", "error");
      return;
    }

    if (
      !formData.selectedPackage.trim() ||
      !formData.travelDate ||
      !formData.returnDate ||
      !formData.pickupLocation.trim() ||
      !formData.totalPrice
    ) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    try {
      const res = await fetch(`https://ass-server-1.onrender.com/tours/${tour._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalPrice: Number(formData.totalPrice),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Tour updated successfully", "success");
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

  const modalBg = isDark ? "bg-gray-800 text-gray-100" : "bg-white text-black";
  const inputBg = isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-black border-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg w-full max-w-md ${modalBg}`}>
        <h2 className="text-xl font-bold mb-4 text-center">Edit Tour Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="selectedPackage"
            value={formData.selectedPackage}
            onChange={handleChange}
            placeholder="Package Type"
            className={`w-full border p-2 rounded ${inputBg}`}
            required
          />
          <input
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${inputBg}`}
            required
          />
          <input
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${inputBg}`}
            required
          />
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            placeholder="Pickup Location"
            className={`w-full border p-2 rounded ${inputBg}`}
            required
          />
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice}
            onChange={handleChange}
            placeholder="Total Price"
            className={`w-full border p-2 rounded ${inputBg}`}
            required
          />
          <input
            type="url"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            placeholder="Photo URL"
            className={`w-full border p-2 rounded ${inputBg}`}
          />
          <input
            type="url"
            name="mapUrl"
            value={formData.mapUrl}
            onChange={handleChange}
            placeholder="Map URL"
            className={`w-full border p-2 rounded ${inputBg}`}
          />
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Special Requests"
            className={`w-full border p-2 rounded ${inputBg}`}
          />

          {/* Features Checkboxes */}
          <div className="grid grid-cols-2 gap-2">
            {["hotel", "car", "boat", "restaurant"].map((key) => (
              <label key={key} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  name={key}
                  checked={formData.features[key]}
                  onChange={handleChange}
                />
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTourModal;
