import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

const TourFormModal = ({ isOpen, onClose, tourData }) => {
  const { user } = useContext(AuthContext);
  const {
    title = "",
    image = "",
    googleMap = "",
    price = 0,
    hotel = "",
    car = "",
    boat = "",
    restaurant = "",
  } = tourData || {};

  const initialFormState = {
    selectedPackage: "single",
    travelDate: "",
    returnDate: "",
    pickupLocation: "",
    specialRequests: "",
    photo: image,
    mapUrl: googleMap,
    totalPrice: price,
    features: { hotel: false, car: false, boat: false, restaurant: false },
    userEmail: user?.email || "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      photo: image,
      mapUrl: googleMap,
      totalPrice: price,
      userEmail: user?.email || "",
    }));
  }, [image, googleMap, price, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    if (["hotel", "car", "boat", "restaurant"].includes(id)) {
      setFormData((prev) => ({
        ...prev,
        features: { ...prev.features, [id]: checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedServices = Object.entries(formData.features)
      .filter(([_, val]) => val)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(", ");

    const submissionData = {
      ...formData,
      specialRequests: `Selected Services: ${selectedServices}\n${formData.specialRequests}`,
    };

    try {
      const res = await fetch("https://ass-server-1.onrender.com/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();
      if (data.insertedId || data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Booking Successful!",
          text: "Your tour has been booked successfully.",
        });
        setFormData(initialFormState);
        onClose();
      } else throw new Error("Server error");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-yellow-600 dark:text-yellow-400">
          {title ? `Book: ${title}` : "Book Your Tour"}
        </h2>

        {image && (
          <img
            src={image}
            alt="Tour"
            className="w-full h-48 object-cover rounded shadow mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <select
            id="selectedPackage"
            value={formData.selectedPackage}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          >
            <option value="single">Single</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
          </select>

          <input
            id="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            placeholder="Pickup Location"
            className="border p-2 rounded-lg"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              id="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="date"
              id="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            {["hotel", "car", "boat", "restaurant"].map((service) => (
              <label key={service} className="flex items-center gap-2 capitalize">
                <input
                  type="checkbox"
                  id={service}
                  checked={formData.features[service]}
                  onChange={handleChange}
                />
                {service}
              </label>
            ))}
          </div>

          <textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Special Requests"
            className="border p-2 rounded-lg"
          />

          <div className="flex gap-2">
            <input
              id="totalPrice"
              type="number"
              value={formData.totalPrice}
              onChange={handleChange}
              placeholder="Total Price"
              className="border p-2 rounded-lg flex-1"
              required
            />
            <input
              id="photo"
              type="url"
              value={formData.photo}
              onChange={handleChange}
              placeholder="Photo URL"
              className="border p-2 rounded-lg flex-1"
            />
          </div>

          {formData.mapUrl && (
            <div className="w-full h-48 border rounded shadow overflow-hidden">
              <iframe
                src={formData.mapUrl}
                title="Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold`}
          >
            {loading ? "Booking..." : `Confirm Booking - $${formData.totalPrice}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TourFormModal;
