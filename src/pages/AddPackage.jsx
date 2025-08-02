import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import HeroSection from "./addpackageBanner";

const defaultForm = {
  hotelName: "",
  hotelPrice: "",
  hotelLocation: "",
  googleMap: "",
  starRating: 0,
  description: "",
  photoUrl: "",
  features: {
    wifi: false,
    restaurant: false,
    parking: false,
    conference: false,
    banquet: false,
  },
};

const UpdatePackage = () => {
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

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

  const handleStarClick = (star) => {
    setFormData((prev) => ({
      ...prev,
      starRating: star,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://ass-server-1.onrender.com/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="min-h-screen bg-white text-black">
      <Helmet>
        <title>Update Hotel Package | Travel-Tours-Agency</title>
        <meta name="description" content="Update existing hotel details." />
      </Helmet>

      <HeroSection />

      <section className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-10">
        <aside className="md:w-1/3 bg-gray-100 p-6 rounded-xl shadow space-y-4">
          <h3 className="text-2xl font-semibold text-blue-700">Why Update?</h3>
          <p>Keep hotel info current to attract more guests and improve transparency.</p>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Edit pricing and location</li>
            <li>Update amenities or description</li>
            <li>Ensure accurate Google Maps info</li>
          </ul>
        </aside>

        <form onSubmit={handleSubmit} className="md:w-2/3 space-y-8">
          <h2 className="text-3xl font-bold text-blue-700 text-center">Update Hotel Package</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField name="hotelName" label="Hotel Name" value={formData.hotelName} onChange={handleChange} />
            <InputField name="hotelPrice" label="Hotel Price ($)" type="number" value={formData.hotelPrice} onChange={handleChange} />
            <InputField name="hotelLocation" label="Location" value={formData.hotelLocation} onChange={handleChange} />
            <InputField name="googleMap" label="Google Map URL" type="url" value={formData.googleMap} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Star Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`text-xl cursor-pointer transition ${
                    formData.starRating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Features</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(formData.features).map(([key, val]) => (
                <Checkbox key={key} name={key} label={key} checked={val} onChange={handleChange} />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the hotel and amenities"
              className="w-full px-4 py-2 border rounded-md text-black"
            />
          </div>

          <div>
            <label htmlFor="photoUrl" className="block text-sm font-medium mb-1">Photo URL</label>
            <div className="flex items-center gap-4">
              <img
                src={formData.photoUrl || "https://source.unsplash.com/60x60/?hotel"}
                alt="Preview"
                className="w-14 h-14 rounded border object-cover"
              />
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-black"
                placeholder="https://example.com/hotel.jpg"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Package"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const InputField = ({ name, label, value, onChange, placeholder = "", type = "text" }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-md text-black"
    />
  </div>
);

const Checkbox = ({ name, label, checked, onChange }) => (
  <label className="inline-flex items-center space-x-2 capitalize">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="form-checkbox text-blue-600"
    />
    <span>{label}</span>
  </label>
);

export default UpdatePackage;
