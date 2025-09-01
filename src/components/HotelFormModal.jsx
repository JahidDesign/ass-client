// src/components/HotelFormModal.jsx
import React, { useState, useEffect, useContext } from "react";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const defaultForm = {
  hotelName: "",
  hotelPrice: "",
  hotelLocation: "",
  googleMap: "",
  starRating: 0,
  description: "",
  photoUrl: "",
  userEmail: "",
  features: {
    wifi: false,
    restaurant: false,
    parking: false,
    conference: false,
    banquet: false,
  },
};

const HotelFormModal = ({ isOpen, onClose, hotelData }) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState(hotelData || defaultForm);
  const [loading, setLoading] = useState(false);

  const isDark = theme === "dark";
  const inputBg = isDark
    ? "bg-gray-800 text-gray-100 border border-gray-600 focus:ring focus:ring-yellow-500"
    : "bg-white text-black border border-gray-300 focus:ring focus:ring-blue-400";

  // Auto-fill user email
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, userEmail: user.email }));
    }
  }, [user]);

  useEffect(() => {
    if (hotelData) setFormData(hotelData);
  }, [hotelData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in formData.features) {
      setFormData((prev) => ({
        ...prev,
        features: { ...prev.features, [name]: checked },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleStarClick = (star) => {
    setFormData((prev) => ({ ...prev, starRating: star }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://ass-server-sy-travles.onrender.com/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.insertedId || data.acknowledged) {
        Swal.fire({
          title: "Hotel package updated!",
          text: "The hotel information has been successfully saved.",
          icon: "success",
        });
        setFormData(defaultForm);
        onClose();
      } else throw new Error("Server error");
    } catch (err) {
      console.error("Update failed", err);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-4">
      <div className={`w-full max-w-2xl p-6 rounded-2xl ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} shadow-lg relative`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">
          {hotelData ? "Update Hotel Package" : "Add Hotel Package"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField name="hotelName" label="Hotel Name" value={formData.hotelName} onChange={handleChange} inputClass={inputBg} />
            <InputField name="hotelPrice" label="Price ($)" type="number" value={formData.hotelPrice} onChange={handleChange} inputClass={inputBg} />
          </div>

          {/* Location & Google Map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField name="hotelLocation" label="Location" value={formData.hotelLocation} onChange={handleChange} inputClass={inputBg} />
            <InputField name="googleMap" label="Google Map URL" type="url" value={formData.googleMap} onChange={handleChange} inputClass={inputBg} />
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-1">Star Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`text-xl cursor-pointer transition ${formData.starRating >= star ? "text-yellow-400" : "text-gray-400"}`}
                />
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium mb-1">Features</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(formData.features).map(([key, val]) => (
                <Checkbox key={key} name={key} label={key} checked={val} onChange={handleChange} />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the hotel and amenities"
              className={`w-full px-4 py-2 rounded-md ${inputBg}`}
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium mb-1">Photo URL</label>
            <div className="flex items-center gap-3">
              <img src={formData.photoUrl || "https://source.unsplash.com/60x60/?hotel"} alt="Preview" className="w-14 h-14 rounded border object-cover" />
              <input type="url" name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="https://example.com/hotel.jpg" className={`w-full px-4 py-2 rounded-md ${inputBg}`} />
            </div>
          </div>

          <div className="text-center">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow disabled:opacity-50">
              {loading ? "Saving..." : hotelData ? "Update Package" : "Add Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* InputField Component */
const InputField = ({ name, label, value, onChange, placeholder = "", type = "text", inputClass }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label>
    <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-4 py-2 rounded-md ${inputClass}`} />
  </div>
);

/* Checkbox Component */
const Checkbox = ({ name, label, checked, onChange }) => (
  <label className="inline-flex items-center space-x-2 capitalize">
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="form-checkbox text-blue-600 border-gray-400" />
    <span>{label}</span>
  </label>
);

export default HotelFormModal;
