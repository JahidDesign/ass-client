// src/pages/MyTours.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSuitcaseRolling,
  FaClipboardList,
  FaRegSadTear,
} from "react-icons/fa";

const MyTours = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    selectedPackage: "",
    pickupLocation: "",
    travelDate: "",
    returnDate: "",
    totalPrice: "",
    specialRequests: "",
    photo: "",
    mapUrl: "",
  });

  // Fetch tours for logged-in user
  useEffect(() => {
    if (!user?.email) return;
    const fetchTours = async () => {
      try {
        const res = await fetch("https://ass-server-sy-travles.onrender.com/tours");
        const data = await res.json();
        const userTours = data.filter((tour) => tour.userEmail === user.email);
        setTours(userTours);
      } catch (err) {
        console.error("Failed to fetch tours:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [user?.email]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) return;

    const newTour = {
      ...formData,
      userEmail: user.email, // auto-selected email
      features: { hotel: true, guide: true }, // sample features
    };

    try {
      const res = await fetch("https://ass-server-sy-travles.onrender.com/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTour),
      });

      if (res.ok) {
        const savedTour = await res.json();
        setTours((prev) => [...prev, savedTour]);
        setFormData({
          title: "",
          selectedPackage: "",
          pickupLocation: "",
          travelDate: "",
          returnDate: "",
          totalPrice: "",
          specialRequests: "",
          photo: "",
          mapUrl: "",
        });
        setIsModalOpen(false);
        alert("Tour booked successfully!");
      }
    } catch (err) {
      console.error("Error booking tour:", err);
    }
  };

  if (loading) {
    return (
      <p className="text-center py-10 text-lg flex items-center justify-center gap-2">
        <FaSuitcaseRolling className="animate-spin text-blue-500" />
        Loading your tours...
      </p>
    );
  }

  return (
    <div
      className={`max-w-6xl mx-auto px-6 py-10 ${
        theme === "dark" ? " text-white" : " text-black"
      }`}
    >
      {/* Headline & Book Tour Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FaSuitcaseRolling className="text-blue-500" /> My Booked Tours
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Book Tour
        </button>
      </div>

      {/* Book Tour Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={`w-full max-w-lg p-6 rounded-xl shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Book a New Tour</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Auto-filled email */}
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="input input-bordered w-full p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
              />

              <input
                type="text"
                name="selectedPackage"
                placeholder="Package Name"
                value={formData.selectedPackage}
                onChange={handleChange}
                className="input input-bordered w-full p-2 rounded"
                required
              />
              <input
                type="text"
                name="Title"
                placeholder="Package Name"
                value={formData.title}
                onChange={handleChange}
                className="input input-bordered w-full p-2 rounded"
                required
              />
              <input
                type="text"
                name="pickupLocation"
                placeholder="Pickup Location"
                value={formData.pickupLocation}
                onChange={handleChange}
                className="input input-bordered w-full p-2 rounded"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  className="input input-bordered w-full p-2 rounded"
                  required
                />
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  className="input input-bordered w-full p-2 rounded"
                  required
                />
              </div>
              <input
                type="number"
                name="totalPrice"
                placeholder="Total Price"
                value={formData.totalPrice}
                onChange={handleChange}
                className="input input-bordered w-full p-2 rounded"
                required
              />
              <input
                type="url"
                name="photo"
                placeholder="Photo URL"
                value={formData.photo}
                onChange={handleChange}
                className="input input-bordered w-full p-2 rounded"
                required
              />
              <input
                type="url"
                name="mapUrl"
                placeholder="Google Map URL"
                value={formData.mapUrl}
                onChange={handleChange}
                className="input input-bordered w-full p-2 rounded"
              />
              <textarea
                name="specialRequests"
                placeholder="Special Requests"
                value={formData.specialRequests}
                onChange={handleChange}
                className="textarea textarea-bordered w-full p-2 rounded"
              ></textarea>

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

      {/* Tours Display */}
      {tours.length === 0 ? (
        <p className="text-center py-10 text-gray-600 dark:text-gray-400 flex flex-col items-center gap-2">
          <FaRegSadTear className="text-4xl text-yellow-500" />
          No tours booked with your email{" "}
          <span className="font-semibold">{user?.email}</span>.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div
              key={tour._id}
              className={`shadow-lg rounded-xl overflow-hidden border hover:shadow-xl transition ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <img
                src={tour.photo}
                alt={tour.selectedPackage}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-3">
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 capitalize">
                  {tour.title} Package
                </h2>
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 capitalize">
                  {tour.selectedPackage} Package
                </h2>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  <a
                    href={tour.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {tour.pickupLocation}
                  </a>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-green-500" />
                    <span>Travel: {tour.travelDate}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-orange-500" />
                    <span>Return: {tour.returnDate}</span>
                  </p>
                </div>
                {tour.specialRequests && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FaClipboardList className="text-purple-500" />{" "}
                    {tour.specialRequests}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {tour.features &&
                    Object.entries(tour.features).map(([key, val]) => (
                      <span
                        key={key}
                        className={`flex items-center gap-1 ${
                          val ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {val ? <FaCheckCircle /> : <FaTimesCircle />}
                        {key}
                      </span>
                    ))}
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${tour.totalPrice}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created by: {tour.userEmail}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTours;
