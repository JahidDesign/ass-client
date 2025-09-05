import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import HeroSection from "./addpackageBanner";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import  AnimatedSection from "../components/secret/AnimatedSection";
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

const UpdatePackage = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const isDark = theme === "dark";

  const bgClass = isDark ? "bg-gray-900" : "bg-white";
  const textClass = isDark ? "text-gray-100" : "text-gray-900";
  const cardBg = isDark ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900";
  const inputBg = isDark
    ? "bg-gray-800 text-gray-100 border border-gray-600 focus:ring focus:ring-yellow-500"
    : "bg-white text-black border border-gray-300 focus:ring focus:ring-blue-400";

  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  // Auto-fill user email
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, userEmail: user.email }));
    }
  }, [user]);

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
      }
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
    <div
      className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-300`}
    >
      <Helmet>
        <title>Update Hotel Package | Travel-Tours-Agency</title>
        <meta name="description" content="Update existing hotel details." />
      </Helmet>

      <HeroSection />
     <AnimatedSection>
      <section className="max-w-6xl mb-5 mx-auto p-6 flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside
          className={`md:w-1/3 p-6 rounded-xl shadow space-y-4 ${cardBg}`}
        >
          <h3 className="text-2xl font-semibold text-blue-500">
            Why Update?
          </h3>
          <p>
            Keep hotel info current to attract more guests and improve
            transparency.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Edit pricing and location</li>
            <li>Update amenities or description</li>
            <li>Ensure accurate Google Maps info</li>
          </ul>
        </aside>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`md:w-2/3 space-y-8 p-6 rounded-xl shadow ${cardBg}`}
        >
          <h2 className="text-3xl font-bold text-blue-500 text-center">
            Update Hotel Package
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              name="hotelName"
              label="Hotel Name"
              value={formData.hotelName}
              onChange={handleChange}
              inputClass={inputBg}
            />
            <InputField
              name="hotelPrice"
              label="Hotel Price ($)"
              type="number"
              value={formData.hotelPrice}
              onChange={handleChange}
              inputClass={inputBg}
            />
            <InputField
              name="hotelLocation"
              label="Location"
              value={formData.hotelLocation}
              onChange={handleChange}
              inputClass={inputBg}
            />
            <InputField
              name="googleMap"
              label="Google Map URL"
              type="url"
              value={formData.googleMap}
              onChange={handleChange}
              inputClass={inputBg}
            />
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Star Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`text-xl cursor-pointer transition ${
                    formData.starRating >= star
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Features
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(formData.features).map(([key, val]) => (
                <Checkbox
                  key={key}
                  name={key}
                  label={key}
                  checked={val}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the hotel and amenities"
              className={`w-full px-4 py-2 rounded-md ${inputBg}`}
            />
          </div>

          {/* Photo */}
          <div>
            <label
              htmlFor="photoUrl"
              className="block text-sm font-medium mb-1"
            >
              Photo URL
            </label>
            <div className="flex items-center gap-4">
              <img
                src={
                  formData.photoUrl || "https://source.unsplash.com/60x60/?hotel"
                }
                alt="Preview"
                className="w-14 h-14 rounded border object-cover"
              />
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md ${inputBg}`}
                placeholder="https://example.com/hotel.jpg"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg disabled:opacity-50 shadow"
            >
              {loading ? "Updating..." : "Update Package"}
            </button>
          </div>
        </form>
      </section>
      </AnimatedSection>
    </div>
  );
};

/* InputField Component */
const InputField = ({
  name,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  inputClass,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-1">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 rounded-md ${inputClass}`}
    />
  </div>
);

/* Checkbox Component */
const Checkbox = ({ name, label, checked, onChange }) => (
  <label className="inline-flex items-center space-x-2 capitalize">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="form-checkbox text-blue-600 border-gray-400"
    />
    <span>{label}</span>
  </label>
);

export default UpdatePackage;
